from django.conf import settings
from django.http import JsonResponse

# STILL USE DUMMY DATA
# TODO: GET CORRECT DATA

def get_detail_country_gold_medals(request):
    country = request.GET.get('country')
    result = {
        'year': [2006, 2010, 2014, 2018],
        'golds': [15, 20, 30, 23],
    }
    return JsonResponse(result)

def test_gisela(request):
    data = settings.TOTAL_MEDAL_JSON
    print (data)
    # TODO: manipulate data first
    return JsonResponse(data)

