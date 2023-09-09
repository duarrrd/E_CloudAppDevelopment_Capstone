from django.db import models

# Create your models here.

# Car Make model
class CarMake(models.Model):
    # Fields for CarMake
    name = models.CharField(max_length=255)
    description = models.TextField()
    # Add any other fields you want for CarMake

    def __str__(self):
        return self.name  # Return the name as the string representation of the object

# Car Model model
class CarModel(models.Model):
    # Fields for CarModel
    make = models.ForeignKey(CarMake, on_delete=models.CASCADE)  # Many-To-One relationship to CarMake
    name = models.CharField(max_length=255)
    dealer_id = models.IntegerField()  # Refers to a dealer created in Cloudant database
    TYPE_CHOICES = (
        ('Sedan', 'Sedan'),
        ('SUV', 'SUV'),
        ('WAGON', 'WAGON'),
        # Add other choices as needed
    )
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    year = models.DateField()
    # Add any other fields you want for CarModel

    def __str__(self):
        return f"{self.make.name} - {self.name}"  # Return a string representation of the CarModel object
