from django.contrib import admin
from .models import CarMake, CarModel

# Inline admin for CarModel
class CarModelInline(admin.StackedInline):
    model = CarModel
    extra = 1  # Number of empty forms to display for adding CarModel objects inline

# Admin class for CarModel
class CarModelAdmin(admin.ModelAdmin):
    list_display = ('name', 'make', 'dealer_id', 'type', 'year')
    list_filter = ('make', 'type', 'year')
    search_fields = ('name', 'make__name', 'dealer_id')
    list_per_page = 20  # Number of CarModel objects to display per page in the admin

# Admin class for CarMake with CarModelInline
class CarMakeAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name',)
    inlines = [CarModelInline]  # Add the CarModelInline to the CarMake admin page

# Register your models here.
admin.site.register(CarMake, CarMakeAdmin)  # Register CarMake model with its admin
admin.site.register(CarModel, CarModelAdmin)  # Register CarModel model with its admin
