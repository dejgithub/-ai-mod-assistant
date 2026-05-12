const BACKEND_URL = 'https://your-backend.onrender.com';

export interface AnalysisResult {
  toxicity_score: number;
  spam_score: number;
  hate_speech_score: number;
  nsfw_score: number;
  risk_level: 'SAFE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  suggested_action: 'APPROVE' | 'REMOVE' | 'WARN' | 'ESCALATE';
  ai_explanation: string;
  reasons: string[];
  ai_confidence: number;
}

export async function analyzeContent(
  title: string,
  content: string,
  author: string,
  subreddit: string,
  postId?: string
): Promise<AnalysisResult> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/moderation/analyze-devvit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, author, subreddit, post_id: postId }),
    });
    if (response.ok) {
      return await response.json();
    }
  } catch {
    console.log('Backend unreachable, using fallback analysis');
  }

  return fallbackAnalysis(title, content);
}

export async function analyzeComment(content: string, author: string, subreddit: string): Promise<AnalysisResult> {
  return analyzeContent('', content, author, subreddit);
}

function fallbackAnalysis(title: string, content: string): AnalysisResult {
  const text = `${title} ${content}`.toLowerCase();

  const spamPatterns = [
    /free.*click|buy.*now|limited.*offer|click.*here/i,
    /earn.*money|work.*home|sign.*up|exclusive.*deal/i,
    /gift.*card|win.*free|get.*rich|act.*now/i,
  ];
  const toxicityPatterns = [
    /\b(hate|kill|die|stupid|idiot|trash|garbage|useless|dumb|moron|loser)\b/i,
  ];
  const nsfwPatterns = [
    /\b(nsfw|18\+|adult|porn|sex|nude|explicit)\b/i,
  ];

  function patternScore(patternArr: RegExp[], weight: number): number {
    let score = 0;
    for (const p of patternArr) {
      const matches = text.match(p);
      if (matches) score += matches.length * 0.15 * weight;
    }
    return Math.min(1, score);
  }

  const spamScore = patternScore(spamPatterns, 3);
  const toxicityScore = patternScore(toxicityPatterns, 2);
  const nsfwScore = patternScore(nsfwPatterns, 2);

  const maxScore = Math.max(spamScore, toxicityScore, nsfwScore);
  const reasons: string[] = [];

  if (spamScore > 0.5) reasons.push('High probability of spam content detected');
  if (toxicityScore > 0.5) reasons.push('Toxic language detected in post');
  if (nsfwScore > 0.3) reasons.push('NSFW content detected');

  const allCapsRatio = title.length > 0 ? title.split('').filter(c => c >= 'A' && c <= 'Z').length / title.length : 0;
  const exclaimCount = (text.match(/!/g) || []).length;
  const hasUrl = /https?:\/\/\S+/.test(content);

  if (allCapsRatio > 0.7 && title.length > 10) reasons.push('Excessive use of capital letters');
  if (exclaimCount > 3) reasons.push('Multiple exclamation marks suggest spam');
  if (hasUrl && spamScore > 0.3) reasons.push('Suspicious URL detected in content');

  let riskLevel: AnalysisResult['risk_level'];
  let suggestedAction: AnalysisResult['suggested_action'];
  let confidence: number;

  if (maxScore >= 0.8) {
    riskLevel = 'CRITICAL';
    suggestedAction = 'REMOVE';
    confidence = 0.95;
  } else if (maxScore >= 0.6) {
    riskLevel = 'HIGH';
    suggestedAction = 'REMOVE';
    confidence = 0.85;
  } else if (maxScore >= 0.4) {
    riskLevel = 'MEDIUM';
    suggestedAction = 'WARN';
    confidence = 0.7;
  } else if (maxScore >= 0.2) {
    riskLevel = 'LOW';
    suggestedAction = 'ESCALATE';
    confidence = 0.55;
  } else {
    riskLevel = 'SAFE';
    suggestedAction = 'APPROVE';
    confidence = 0.9;
    reasons.push('Content appears safe');
  }

  return {
    toxicity_score: Math.round(toxicityScore * 100) / 100,
    spam_score: Math.round(spamScore * 100) / 100,
    hate_speech_score: 0,
    nsfw_score: Math.round(nsfwScore * 100) / 100,
    risk_level: riskLevel,
    suggested_action: suggestedAction,
    ai_explanation: `Content flagged with ${riskLevel} risk. Toxicity: ${toxicityScore.toFixed(2)}, Spam: ${spamScore.toFixed(2)}. Recommended action: ${suggestedAction}.`,
    reasons,
    ai_confidence: confidence,
  };
}
