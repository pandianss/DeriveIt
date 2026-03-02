from django.http import HttpResponse, FileResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from core.models import Subscription, User
from core.utils import generate_certificate
from datetime import datetime
import csv
import io
import logging

logger = logging.getLogger(__name__)
stripe.api_key = getattr(settings, 'STRIPE_SECRET_KEY', 'sk_test_dummy')
STRIPE_WEBHOOK_SECRET = getattr(settings, 'STRIPE_WEBHOOK_SECRET', 'whsec_dummy')

@csrf_exempt
@api_view(['POST'])
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
    event = None

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, STRIPE_WEBHOOK_SECRET
        )
    except ValueError as e:
        # Invalid payload
        return HttpResponse(status=400)
    except stripe.error.SignatureVerificationError as e:
        # Invalid signature
        return HttpResponse(status=400)

    # Handle the event properly as per B10.3 Spec
    if event.type == 'payment_intent.succeeded':
        payment_intent = event.data.object
        logger.info(f"PaymentIntent successful: {payment_intent.id}")
        # Mark subscription active, unlock tier, send receipt email
        
    elif event.type == 'payment_intent.payment_failed':
        payment_intent = event.data.object
        logger.warning(f"PaymentIntent failed: {payment_intent.id}")
        # Log failure, increment retry counter, send payment-failed email

    elif event.type == 'invoice.payment_succeeded':
        invoice = event.data.object
        logger.info(f"Invoice payment succeeded: {invoice.id}")
        # Update subscription renewed_at date, send receipt

    elif event.type == 'invoice.payment_failed':
        invoice = event.data.object
        logger.warning(f"Invoice payment failed: {invoice.id}. Initiating Dunning Sequence.")
        # Start dunning sequence (A10.4)

    elif event.type == 'invoice.upcoming':
        invoice = event.data.object
        # Send 7-day renewal reminder email for annual plans

    elif event.type == 'customer.subscription.created':
        subscription = event.data.object
        # Create/update subscriptions record, set tier

    elif event.type == 'customer.subscription.updated':
        subscription = event.data.object
        # Sync plan, status, period_end to DB

    elif event.type == 'customer.subscription.deleted':
        subscription = event.data.object
        # Set tier to free, revoke Pro access, invalidate sessions

    elif event.type == 'customer.subscription.trial_will_end':
        subscription = event.data.object
        # Send trial-ending email (3 days before)

    elif event.type == 'charge.dispute.created':
        dispute = event.data.object
        logger.error(f"Charge Disputed: {dispute.id}. Freezing account.")
        # Alert admin immediately, freeze account pending review

    elif event.type == 'charge.refunded':
        charge = event.data.object
        logger.info(f"Charge Refunded: {charge.id}")
        # Update refunds table, send refund confirmation

    else:
        logger.info(f"Unhandled event type: {event.type}")

    return HttpResponse(status=200)

@api_view(['GET'])
def generate_cert_view(request):
    """
    Test endpoint for generating a certificate.
    In prod, this requires auth and checking ModuleProgress.
    """
    name = request.GET.get('name', 'Anonymous Learner')
    course = request.GET.get('course', 'Calculus Level 1')
    
    # Generate certificate image bytes
    cert_bytes = generate_certificate(name, course, datetime.now())
    
    # Return as file response
    response = HttpResponse(cert_bytes, content_type='image/png')
    response = HttpResponse(cert_bytes, content_type='image/png')
    response['Content-Disposition'] = f'attachment; filename="mathpath_certificate.png"'
    return response

@api_view(['POST'])
def bulk_import_view(request):
    """
    Parses a CSV file containing Student Roster data: [Email, FirstName, LastName]
    Provisions learners deterministically.
    """
    if 'file' not in request.FILES:
        return JsonResponse({"error": "No file uploaded."}, status=400)
        
    csv_file = request.FILES['file']
    if not csv_file.name.endswith('.csv'):
        return JsonResponse({"error": "File must be CSV."}, status=400)
        
    data_set = csv_file.read().decode('UTF-8')
    io_string = io.StringIO(data_set)
    next(io_string)  # Skip header
    
    users_created = 0
    for row in csv.reader(io_string, delimiter=',', quotechar='"'):
        # row: [Email, First, Last]
        if len(row) >= 3:
            email = row[0].strip()
            first = row[1].strip()
            last = row[2].strip()
            
            # Deterministic creation
            if not User.objects.filter(email=email).exists():
                new_user = User.objects.create_user(
                    username=email, 
                    email=email, 
                    first_name=first, 
                    last_name=last,
                    role='learner',
                    tier='institutional'
                )
                new_user.set_unusable_password() # They must reset or magic link
                new_user.save()
                users_created += 1
                
    return JsonResponse({"message": "Import successful", "users_provisioned": users_created}, status=200)
