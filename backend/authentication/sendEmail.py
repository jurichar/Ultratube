from django.core.mail import send_mail


def sendEmail(subject="", message="", mailSend="hypertube@gmail.com", mailReceiver=""):
    send_mail(
        subject,
        message,
        mailSend,
        [mailReceiver],
        fail_silently=False,
    )
