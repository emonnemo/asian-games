"""asian_games URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('get-country-gold-medals/', views.get_country_gold_medals, name='country-gold-medals'),
    path('get-detail-country-gold-medals/', views.get_detail_country_gold_medals, name='detail-country-gold-medals'),
    path('get-indonesia-medals/', views.get_indonesia_medals, name='indonesia-medals'),
    path('get-indonesia-yearly-medals/', views.get_indonesia_yearly_medals, name='indonesia-yearly-medals'),
    path('get-indonesia-sport-medals/', views.get_indonesia_sport_medals, name='indonesia-sport-medals'),
    path('get-indonesia-sport-summary/', views.get_indonesia_sport_summary, name='indonesia-sport-summary'),
    path('test-gisela/', views.test_gisela, name='test-gisela'),
]
