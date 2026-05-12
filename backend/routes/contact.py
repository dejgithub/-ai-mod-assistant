from fastapi import APIRouter
from backend.models import ContactMessage

router = APIRouter(prefix="/api/contact", tags=["Contact"])


@router.post("/send")
def send_message(message: ContactMessage):
    return {
        "status": "success",
        "message": "Thank you for your message! We will get back to you soon.",
        "data": message.model_dump(),
    }
