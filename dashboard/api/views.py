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

def get_indonesia_medals(request):
    data = settings.INDONESIA_PROGRESS_JSON
    years, series = [], []
    lowest_rank = 1
    for yearly_medal in data:
        medals = yearly_medal['Data']
        serie = []
        # serie = [year, rank, total_medals]
        serie.append(int(yearly_medal['Tahun']))
        serie.append(int(medals['Peringkat']))
        serie.append(int(medals['Emas']) + int(medals['Perak']) + int(medals['Perunggu']))

        years.append(int(yearly_medal['Tahun']))
        series.append(serie)

        if lowest_rank < int(medals['Peringkat']):
            lowest_rank = int(medals['Peringkat'])
    print(series)
    result = {
        'series': series,
        'years': years,
        'lowestRank': lowest_rank
    }
    return JsonResponse(result)

def test_gisela(request):
    data = settings.TOTAL_MEDAL_JSON
    print (data)
    # TODO: manipulate data first
    return JsonResponse(data)

