from django.contrib import admin
from django.urls import path
from core import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/webhooks/stripe', views.stripe_webhook, name='stripe_webhook'),
    path('api/certificates/generate', views.generate_cert_view, name='generate_certificate'),
    path('api/institution/bulk-import', views.bulk_import_view, name='bulk_import'),
]
