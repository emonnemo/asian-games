from django.conf import settings
from django.http import JsonResponse
import json
import math

# STILL USE DUMMY DATA
# TODO: GET CORRECT DATA

def get_country_gold_medals(request):
    data = settings.ASIA_MEDAL_JSON
    countries = []
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
            countries.append(country)

    result = {
        'countries': countries,
        'years': years,
        'hosts': hosts,
        'countries_medals': countries_medals,
    }
    return JsonResponse(result)

def get_detail_country_gold_medals(request):
    country = request.GET.get('country')
    data = settings.ASIA_MEDAL_JSON
    years = []
    hosts = []
    golds = {}
    for yearly_data in data:
        year = yearly_data['Tahun']
        host = yearly_data['Tuan Rumah']
        gold_data = yearly_data['Data']

        years.append(year)
        if host == country:
            hosts.append(True)
        else:
            hosts.append(False)
        for country_yearly_data in gold_data:
            country_name = country_yearly_data['Negara']
            if country_name == country:
                gold = int(country_yearly_data['Emas'])
                golds[year] = gold
                break
    
    # Clean up gold data as some countries may not join every event
    for year in years:
        if year not in golds:
            golds[year] = 0

    result = {
        'year': years,
        'golds': list(golds.values()),
        'hosts': hosts,
    }
    return JsonResponse(result)

def get_indonesia_medals(request):
    data = settings.INDONESIA_PROGRESS_JSON
    years = {}
    series = []
    lowest_rank = 1
    i = 0
    for yearly_medal in data:
        medals = yearly_medal['Data']
        serie = []
        # serie = [year, rank, total_medals]
        serie.append(i)
        serie.append(int(medals['Peringkat']))
        serie.append(math.sqrt(int(medals['Emas']) + int(medals['Perak']) + int(medals['Perunggu'])))

        years[i] = int(yearly_medal['Tahun'])
        series.append(serie)

        if lowest_rank < int(medals['Peringkat']):
            lowest_rank = int(medals['Peringkat'])
        i += 1
    result = {
        'series': series,
        'years': years,
        'lowestRank': lowest_rank
    }
    return JsonResponse(result)

def get_indonesia_yearly_medals(request):
    year = request.GET.get('year')
    data = settings.INDONESIA_PROGRESS_JSON
    series = []
    for yearly_medal in data:
        if not yearly_medal['Tahun'] == year:
            continue
        medals = yearly_medal['Data']
        # series = [gold, silver, bronze]
        series.append(int(medals['Emas']))
        series.append(int(medals['Perak']))
        series.append(int(medals['Perunggu']))
    result = {
        'series': series
    }
    return JsonResponse(result)
 
def get_indonesia_sport_medals(request):
    event = request.GET.get('event')
    indo_sport = ["Bridge", "Pencak Silat", "Paralayang", "Panjat Tebing", "Kurash"]
    etc_sport = ["Perahu Naga", "Jet Ski", "Karate", "Olahraga Seluncur - Skateboard", "Sepak Takraw", "Soft Tenis"]

    data = settings.INDONESIA_2018_JSON
    result = {
        'series': [],
        'sports': []
    }  

    emas = {
        'data': [],
        'name': 'Emas'
    }
    perak = {
        'data' : [],
        'name' : 'Perak'
    }
    perunggu = {
        'data' : [],
        'name' : 'Perunggu'
    }

    for sport in data:
        medal = sport['Medali']
    
        if event == "Pilihan Indonesia" :
            if sport['Cabor'] in indo_sport:
                emas['data'].append(medal.get('Emas', 0))
                perak['data'].append(medal.get('Perak', 0))
                perunggu['data'].append(medal.get('Perunggu', 0))
                result['sports'].append(sport['Cabor'])
        elif event == "Lainnya":
            if sport['Cabor'] in etc_sport:
                emas['data'].append(medal.get('Emas', 0))
                perak['data'].append(medal.get('Perak', 0))
                perunggu['data'].append(medal.get('Perunggu', 0))
                result['sports'].append(sport['Cabor'])
        else:
            emas['data'].append(medal.get('Emas', 0))
            perak['data'].append(medal.get('Perak', 0))
            perunggu['data'].append(medal.get('Perunggu', 0))
            result['sports'].append(sport['Cabor'])
        
    emas['data'], perak['data'], perunggu['data'], result['sports'] = map(list, zip(*sorted(zip(emas['data'], perak['data'], perunggu['data'], result['sports']), reverse=True)))
    result['series'].append(emas)
    result['series'].append(perak)
    result['series'].append(perunggu)
    return JsonResponse(result) 

def get_indonesia_sport_summary(request):
    data = settings.INDONESIA_2018_JSON
    indo_sport = ["Bridge", "Pencak Silat", "Paralayang", "Panjat Tebing", "Kurash"]
    etc_sport = ["Perahu Naga", "Jet Ski", "Karate", "Olahraga Seluncur - Skateboard", "Sepak Takraw", "Soft Tenis"]
    indo = 0
    etc = 0
    olympic = 0
    series = []
    for sport in data:
        medal = sport['Medali']
        if sport['Cabor'] in etc_sport:
            etc = etc + medal.get('Emas', 0) + medal.get('Perak', 0) + medal.get('Perunggu', 0)
        elif sport['Cabor'] in indo_sport:
            indo = indo + medal.get('Emas', 0) + medal.get('Perak', 0) + medal.get('Perunggu', 0)
        else :
            olympic = olympic + medal.get('Emas', 0) + medal.get('Perak', 0) + medal.get('Perunggu', 0)
            
    # Series [Olympic, Indo, Else]
    total = olympic + etc + indo
    series.append(olympic/total)
    series.append(indo/total)
    series.append(etc/total)
    result = {
        'series': series,
        'labels': ["Olimpiade", "Pilihan Indonesia", "Lainnya"]
    }   
    return JsonResponse(result) 

def test_gisela(request):
    data = settings.TOTAL_MEDAL_JSON
    print (data)
    # TODO: manipulate data first
    return JsonResponse(data)

