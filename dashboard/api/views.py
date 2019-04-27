from django.conf import settings
from django.http import JsonResponse
import json

# STILL USE DUMMY DATA
# TODO: GET CORRECT DATA

def get_country_gold_medals(request):
    data = settings.ASIA_MEDAL_JSON
    years = []
    hosts = []
    countries_golds = {}
    for yearly_data in data:
        year = yearly_data['Tahun']
        host = yearly_data['Tuan Rumah']
        gold_data = yearly_data['Data']

        years.append(year)
        hosts.append(host)
        for country_yearly_data in gold_data:
            country_name = country_yearly_data['Negara']
            code_name = country_yearly_data['Negara']
            gold = int(country_yearly_data['Emas'])
            if country_name not in countries_golds:
                countries_golds[country_name] = {}
            countries_golds[country_name][year] = gold
    
    # Only returns the country data that has ever be host
    # in the last 10 events

    countries_medals = []
    for country, golds in countries_golds.items():
        if country in hosts:
            countries_medals.append({
                'name': country,
                'code_name': country,
                'data': list(golds.values()),
            })

    result = {
        'years': years,
        'hosts': hosts,
        'countries_medals': countries_medals,
    }
    return JsonResponse(result)

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

