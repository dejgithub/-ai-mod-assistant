import { Devvit } from '@devvit/public-api';
import { analyzeContent, analyzeComment } from './ai-client.js';

Devvit.configure({
  redditAPI: true,
  redis: true,
  http: true,
});

Devvit.addSettings([
  {
    type: 'string',
    name: 'backend-url',
    label: 'AI Backend URL',
    defaultValue: 'https://your-backend.onrender.com',
    scope: 'installation',
    helpText: 'URL of the AI moderation backend API',
  },
  {
    type: 'number',
    name: 'sensitivity',
    label: 'Moderation Sensitivity',
    defaultValue: 0.5,
    scope: 'installation',
    helpText: '0.0 (lenient) to 1.0 (strict)',
    onValidate: ({ value }) => {
      if (value < 0 || value > 1) return 'Sensitivity must be between 0 and 1';
    },
  },
  {
    type: 'boolean',
    name: 'auto-remove',
    label: 'Auto-remove CRITICAL content',
    defaultValue: false,
    scope: 'installation',
    helpText: 'Automatically remove posts flagged as CRITICAL',
  },
  {
    type: 'boolean',
    name: 'auto-report',
    label: 'Auto-report HIGH content',
    defaultValue: true,
    scope: 'installation',
    helpText: 'Automatically report posts flagged as HIGH risk',
  },
]);

const analysisForm = Devvit.createForm(
  {
    title: 'AI Moderation Analysis',
    description: 'Review the AI analysis results for this post',
    fields: [
      { name: 'action', label: 'Take Action', type: 'select', defaultValue: ['none'], required: true,
        options: [
          { label: 'No action (dismiss)', value: 'none' },
          { label: 'Approve post', value: 'approve' },
          { label: 'Remove post', value: 'remove' },
          { label: 'Mark as spam', value: 'spam' },
          { label: 'Lock post', value: 'lock' },
        ],
      },
    ],
    acceptLabel: 'Confirm',
    cancelLabel: 'Cancel',
  },
  async (event, context) => {
    const { action } = event.values;
    const postId = context.postId;
    if (!postId || action === 'none') return;

    try {
      const post = await context.reddit.getPostById(postId);
      switch (action) {
        case 'approve':
          await post.approve();
          context.ui.showToast('Post approved');
          break;
        case 'remove':
          await post.remove(false);
          context.ui.showToast('Post removed');
          break;
        case 'spam':
          await post.remove(true);
          context.ui.showToast('Post marked as spam');
          break;
        case 'lock':
          await post.lock();
          context.ui.showToast('Post locked');
          break;
      }
    } catch (err) {
      context.ui.showToast('Failed to perform action');
      console.error('Action failed:', err);
    }
  }
);

Devvit.addMenuItem({
  label: 'Analyze with AI Mod',
  description: 'Analyze this post for toxicity, spam, hate speech, and NSFW content',
  location: 'post',
  forUserType: 'moderator',
  onPress: async (event, context) => {
    try {
      const postId = event.targetId;
      const post = await context.reddit.getPostById(postId);

      context.ui.showToast('AI Mod is analyzing this post...');

      const result = await analyzeContent(
        post.title,
        post.body || '[link post]',
        post.authorName,
        post.subredditName,
        postId
      );

      const riskEmoji =
        result.risk_level === 'SAFE' ? '✅' :
        result.risk_level === 'LOW' ? '🟢' :
        result.risk_level === 'MEDIUM' ? '🟡' :
        result.risk_level === 'HIGH' ? '🟠' : '🔴';

      const actionEmoji =
        result.suggested_action === 'APPROVE' ? '👍' :
        result.suggested_action === 'REMOVE' ? '🗑️' :
        result.suggested_action === 'WARN' ? '⚠️' : '🚨';

      const reasonsText = result.reasons.map(r => `• ${r}`).join('\n');

      context.ui.showForm(analysisForm);

      await context.redis.set(
        `analysis:${postId}`,
        JSON.stringify(result)
      );
      await context.redis.expire(`analysis:${postId}`, 86400);

      await post.addComment({
        text:
          `## 🤖 AI Moderation Analysis\n\n` +
          `${riskEmoji} **Risk Level:** ${result.risk_level}\n` +
          `${actionEmoji} **Suggested Action:** ${result.suggested_action}\n` +
          `📊 **Confidence:** ${(result.ai_confidence * 100).toFixed(0)}%\n\n` +
          `### Scores\n` +
          `| Category | Score |\n` +
          `|---|---|\n` +
          `| Toxicity | ${result.toxicity_score.toFixed(2)} |\n` +
          `| Spam | ${result.spam_score.toFixed(2)} |\n` +
          `| Hate Speech | ${result.hate_speech_score.toFixed(2)} |\n` +
          `| NSFW | ${result.nsfw_score.toFixed(2)} |\n\n` +
          `### Reasons\n${reasonsText}\n\n` +
          `*${result.ai_explanation}*\n\n` +
          `^(AI Mod Assistant v1.0 · )^(Action taken via the form above)`,
      });
    } catch (err) {
      context.ui.showToast('Analysis failed. Check the backend connection.');
      console.error('Analysis error:', err);
    }
  },
});

Devvit.addMenuItem({
  label: 'Quick Check',
  description: 'Quickly check this comment for policy violations',
  location: 'comment',
  forUserType: 'moderator',
  onPress: async (event, context) => {
    try {
      const commentId = event.targetId;
      const comment = await context.reddit.getCommentById(commentId);

      context.ui.showToast('AI Mod is checking this comment...');

      const result = await analyzeComment(
        comment.body,
        comment.authorName,
        comment.subredditName
      );

      const riskEmoji =
        result.risk_level === 'SAFE' ? '✅' :
        result.risk_level === 'LOW' ? '🟢' :
        result.risk_level === 'MEDIUM' ? '🟡' :
        result.risk_level === 'HIGH' ? '🟠' : '🔴';

      if (result.risk_level === 'SAFE' || result.risk_level === 'LOW') {
        context.ui.showToast(`✅ Comment appears safe (${result.risk_level})`);
      } else {
        context.ui.showToast(`${riskEmoji} ${result.risk_level} - ${result.reasons[0] || 'Flagged'}`);
        await comment.report(`AI Mod: ${result.risk_level} - ${result.reasons.join(', ')}`);
      }
    } catch (err) {
      context.ui.showToast('Quick check failed');
      console.error('Quick check error:', err);
    }
  },
});

Devvit.addMenuItem({
  label: 'Batch Scan Hot Posts',
  description: 'Scan the current hot posts for policy violations',
  location: 'subreddit',
  forUserType: 'moderator',
  onPress: async (event, context) => {
    try {
      context.ui.showToast('Scanning hot posts...');

      const subName = await context.reddit.getCurrentSubredditName();
      const posts = await context.reddit.getHotPosts({
        subredditName: subName,
        limit: 10,
      }).all();

      let scanCount = 0;
      let flagCount = 0;

      for (const post of posts) {
        const result = await analyzeContent(
          post.title,
          post.body || '[link post]',
          post.authorName,
          post.subredditName,
          post.id
        );

        await context.redis.set(
          `analysis:${post.id}`,
          JSON.stringify(result)
        );
        await context.redis.expire(`analysis:${post.id}`, 86400);

        scanCount++;

        if (result.risk_level === 'HIGH' || result.risk_level === 'CRITICAL') {
          flagCount++;
          await post.report(`AI Mod: ${result.risk_level} - ${result.reasons.join(', ')}`);
        }
      }

      context.ui.showToast(
        `Scan complete: ${scanCount} posts scanned, ${flagCount} flagged`
      );
    } catch (err) {
      context.ui.showToast('Batch scan failed');
      console.error('Batch scan error:', err);
    }
  },
});

Devvit.addTrigger({
  event: 'PostSubmit',
  onEvent: async (event, context) => {
    try {
      const post = event.post;
      if (!post || !post.id) return;

      const settings = await context.settings.getAll();

      const result = await analyzeContent(
        post.title || '',
        post.body || '[link post]',
        post.authorName || 'unknown',
        post.subredditName || 'unknown',
        post.id
      );

      await context.redis.set(
        `analysis:${post.id}`,
        JSON.stringify(result)
      );
      await context.redis.expire(`analysis:${post.id}`, 86400);

      if (result.risk_level === 'CRITICAL') {
        const postObj = await context.reddit.getPostById(post.id);

        if (settings['auto-remove']) {
          await postObj.remove(false);
        }
        if (settings['auto-report'] !== false) {
          await postObj.report(`AI Mod Auto: CRITICAL - ${result.reasons.join(', ')}`);
        }

        await postObj.lock();
        await postObj.addComment({
          text:
            `## 🛑 Content Removed\n\n` +
            `This post was automatically removed by **AI Mod Assistant**.\n\n` +
            `**Risk Level:** CRITICAL\n` +
            `**Reason:** ${result.reasons.join(', ')}\n\n` +
            `*If you believe this was a mistake, please review in the mod queue.*`,
        });
      } else if (result.risk_level === 'HIGH' && settings['auto-report'] !== false) {
        const postObj = await context.reddit.getPostById(post.id);
        await postObj.report(`AI Mod Auto: HIGH - ${result.reasons.join(', ')}`);
      }
    } catch (err) {
      console.error('PostSubmit trigger error:', err);
    }
  },
});

const CLEANUP_KEY = 'cleanup:last-run';

Devvit.addSchedulerJob({
  name: 'cleanup-stale-data',
  onRun: async (event, context) => {
    const lastRun = await context.redis.get(CLEANUP_KEY);
    const now = Date.now();

    const keys = await context.redis.scan(0, `analysis:*`, 100);
    let deletedCount = 0;

    for (const key of keys) {
      const ttl = await context.redis.ttl(key);
      if (ttl === -2 || ttl === -1) {
        await context.redis.del(key);
        deletedCount++;
      }
    }

    await context.redis.set(CLEANUP_KEY, now.toString());
    console.log(`Cleanup complete: deleted ${deletedCount} stale keys`);
  },
});

export default Devvit;
