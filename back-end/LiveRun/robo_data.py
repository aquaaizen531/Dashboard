import random
from bson.objectid import ObjectId
from datetime import datetime, timedelta, timezone, UTC
import time
from bson.objectid import ObjectId
import mongodb as mg_db
from pprint import pprint
from math import radians, sin, cos, sqrt, atan2

pos = {
    "loc_1": {
        "loc1": ["10.149782243735608", "76.17570833504477"],
        "loc2": ["10.14980345924374", "76.17577497142892"],
        "loc3": ["10.14971633152989", "76.17580715793524"],
        "loc4": ["10.149701810241934", "76.1757287033261"],
        "place": "kochi",
    },
    "loc_2": {
        "loc1": ["13.061060308257739", "80.28535842976925"],
        "loc2": ["13.061495555619986", "80.28554833497522"],
        "loc3": ["13.06135049316529", "80.28599921689438"],
        "loc4": ["13.060937467653995", "80.28584202870239"],
        "place": "chennai",
    },
    "loc_3": {
        "loc1": ["12.999146947177506", "80.27269772429922"],
        "loc2": ["12.999128402719268", "80.27281541064534"],
        "loc3": ["12.999004916075164", "80.27278322413903"],
        "loc4": ["12.999034971031246", "80.27266386584478"],

        "place": "chennai",
    },
    "loc_4": {
        "loc1": ["9.492648721408777", "76.31777112479394"],
        "loc2": ["9.492525590673779", "76.31781308409457"],
        "loc3": ["9.492486569814872", "76.31757839081936"],
        "loc4": ["9.492617521154278", "76.31755290983519"],

        "place": "alapuzha",
    },
    "loc_5": {
        "loc1": ["8.386594422857588", "76.97667729624705"],
        "loc2": ["8.386696583622943", "76.97670411833565"],
        "loc3": ["8.386662087783101", "76.97681274779445"],
        "loc4": ["8.386573858024965", "76.97677452631821"],
        "place": "tvm",
    },
}

status = ["idle", "cleaning", "charging", "error"]
humidity = [80, 86, 78, 89, 79, 90]
temperature = [30, 28, 32, 27, 31]
batteries = [40, 50, 80, 100, 70, 60]
wastetray = ["empty", "half", "full", "error"]
tide = ["low", "mid", "high", "n/a"]

r_name = ["r_001", "r_002", "r_003", "r_004", "r_005"]
id = ["2111", "2112", "2113", "2114", "2115"]
unique_id = ["1123", "1124", "1125", "1126", "1127"]
userid = ["68355f014e6577b52aaa7066", "684ed8b2f8a8bf79bf0e4595",
          "68317531db31434570f3d067", "68820908d984f13a82d34868", "6888f3213651eedf2d796391"]

random.shuffle(batteries)
distance = 0

today = datetime.now(timezone.utc)


def init_data(userid):

    data = [
        # 1
        {
            "UniqueCode": unique_id[0],
            "data": [
                {
                    "Battery": batteries[0],
                    "DistanceCovered": 0,
                    "Robotuptime": 5125,
                    "Status": status[1],
                    "Wastetraystatus": wastetray[0],
                    "date": today,
                    "tide": random.choice(tide),
                    "humidity": random.choice(humidity),
                    "temp": random.choice(temperature),
                    "operator": ObjectId(userid[0]),
                    "position": {
                        "city": pos["loc_1"]["place"],
                        "lat": pos["loc_1"]["loc1"][0],
                        "lng": pos["loc_1"]["loc1"][1],

                    }
                }
            ],
            "name": r_name[0],
            "operators": [{"date": today, "runtime": 0, "user": ObjectId(userid[0])}],
        },
        # 2
        {
            "UniqueCode": unique_id[1],
            "data": [
                {
                    "Battery":  batteries[1],
                    "DistanceCovered": 0,
                    "Robotuptime": 3190,
                    "Status": status[0],
                    "Wastetraystatus": wastetray[0],
                    "date": today,
                    "tide": random.choice(tide),
                    "humidity": random.choice(humidity),
                    "temp": random.choice(temperature),
                    "operator": ObjectId(userid[1]),
                    "position": {
                        "city": pos["loc_2"]["place"],
                        "lat": pos["loc_2"]["loc1"][0],
                        "lng": pos["loc_2"]["loc1"][1],
                    },
                }
            ],
            "name": r_name[1],
            "operators": [{"date": today, "runtime": 0, "user": ObjectId(userid[1])}],
        },
        # 3
        {
            "UniqueCode": unique_id[2],
            "data": [
                {
                    "Battery":  batteries[2],
                    "DistanceCovered": 0,
                    "Robotuptime": 5125,
                    "Status": status[0],
                    "Wastetraystatus": wastetray[0],
                    "date": today,
                    "tide": random.choice(tide),
                    "humidity": random.choice(humidity),
                    "temp": random.choice(temperature),
                    "operator": ObjectId(userid[2]),
                    "position": {
                        "city": pos["loc_3"]["place"],
                        "lat": pos["loc_3"]["loc1"][0],
                        "lng": pos["loc_3"]["loc1"][1],
                    },
                }
            ],
            "name": r_name[2],
            "operators": [{"date": today, "runtime": 0, "user": ObjectId(userid[2])}],
        },
        # 4
        {
            "UniqueCode": unique_id[3],
            "data": [
                {
                    "Battery":  batteries[3],
                    "DistanceCovered": 0,
                    "Robotuptime": 6356,
                    "Status": status[0],
                    "Wastetraystatus": wastetray[0],
                    "date": today,
                    "tide": random.choice(tide),
                    "humidity": random.choice(humidity),
                    "temp": random.choice(temperature),
                    "operator": ObjectId(userid[3]),
                    "position": {
                        "city": pos["loc_4"]["place"],
                        "lat": pos["loc_4"]["loc1"][0],
                        "lng": pos["loc_4"]["loc1"][1],
                    },

                }
            ],
            "name": r_name[3],
            "operators": [{"date": today, "runtime": 0, "user": ObjectId(userid[3])}],
        },
        # 5
        {
            "UniqueCode": unique_id[4],
            "data": [
                {
                    "Battery":  batteries[4],
                    "DistanceCovered": 0,
                    "Robotuptime": 6356,
                    "Status": status[0],
                    "Wastetraystatus": wastetray[0],
                    "date": today,
                    "tide": random.choice(tide),
                    "humidity": random.choice(humidity),
                    "temp": random.choice(temperature),
                    "operator": ObjectId(userid[4]),
                    "position": {
                        "city": pos["loc_5"]["place"],
                        "lat": pos["loc_5"]["loc1"][0],
                        "lng": pos["loc_5"]["loc1"][1],
                    },
                }
            ],
            "name": r_name[4],
            "operators": [
                {"date": today,
                 "runtime": 0,
                 "user": ObjectId(userid[4])}],
        },
    ]

    return data


# def distance_(db_data, i):

#     location = db_data[i]['data'][0]['position']['lat']

#     found_key = next(
#         (k for k, v in pos[f'loc_{i+1}'].items() if isinstance(v, list) and location in v), None)

#     lat1 = db_data[i]['data'][0]['position']['lat']
#     lon1 = db_data[i]['data'][0]['position']['lng']

#     if found_key[3] == "4":
#         key = 1
#     else:
#         key = int(found_key[3])+1

#     lat2 = pos[f'loc_{i+1}'][f'loc{key}'][0]
#     lon2 = pos[f'loc_{i+1}'][f'loc{key}'][1]

#     next_pos = [lat2, lon2]
#     R = 6371  # Radius of Earth in km (use 6371000 for meters)

#     # Convert degrees to radians
#     lat1, lon1, lat2, lon2 = map(radians, [1, 2, 3, 4])

#     dlat = lat2 - lat1
#     dlon = lon2 - lon1

#     a = sin(dlat / 2)**2 + cos(lat1) * cos(lat2) * sin(dlon / 2)**2
#     c = 2 * atan2(sqrt(a), sqrt(1 - a))

#     distance_km = R * c
#     return distance_km, next_pos

def distance_(db_data, i):

    pos_data = db_data[i]['data'][0]['position']

    step = pos_data.get("step", 1)

    # next step
    next_step = step + 1 if step < 4 else 1

    lat1 = float(pos_data['lat'])
    lon1 = float(pos_data['lng'])

    lat2 = float(pos[f'loc_{i+1}'][f'loc{next_step}'][0])
    lon2 = float(pos[f'loc_{i+1}'][f'loc{next_step}'][1])

    # Save next step
    pos_data["step"] = next_step

    R = 6371

    lat1, lon1, lat2, lon2 = map(
        radians, [lat1, lon1, lat2, lon2]
    )

    dlat = lat2 - lat1
    dlon = lon2 - lon1

    a = sin(dlat/2)**2 + cos(lat1)*cos(lat2)*sin(dlon/2)**2
    c = 2 * atan2(sqrt(a), sqrt(1-a))

    distance_km = R * c

    return distance_km, [str(lat2), str(lon2)]

def rotate_list(lst):
    first = lst.pop(0)
    lst.append(first)
    return lst


def time_now():
    now = datetime.now()
    if now.hour == 0 and now.minute == 0:
        return True
    else:
        print(now.hour, now.minute)
        return False


def loop_data(data, db_data, i, TOTAL_SECONDS):

    # position
    data['distance_cov'], data['position'] = distance_(db_data, i)

    # wastetray
    data['wastetray'] = db_data[i]['data'][0]['Wastetraystatus']
    if TOTAL_SECONDS > 7200:
        data['wastetray'] = wastetray[1]
    elif TOTAL_SECONDS > 18000:
        data['wastetray'] = wastetray[2]

    return data


def main():

    # TIME
    INTERVAL_SECONDS = 6
    TOTAL_SECONDS = 0
    user_list = userid
    update_db1 = ['D-RubeLabs', "bots"]
    push_db2 = ["D-RubeLabs", "Bot_History"]
    # INITIAL
    FLAG = True

    # Checking whether db is empty
    if len(mg_db.get_data(update_db1)) > 1:
        print("Db Is Empty")
        FLAG = False

    if FLAG:
        print("Pushing Initial data")
        data = init_data(user_list)
        for i in range(len(data)):
            data[i] = {**data[i], "_id": ObjectId()}
            mg_db.push_manydata(data[i], update_db1)
            mg_db.push_manydata(data[i], push_db2)
        FLAG = False

    while not FLAG:
        print("Loop")

        if time_now():
            TOTAL_SECONDS = 0
            print("!!!!!!!!!!!!!!!Next Day!!!!!!!!!!!!!!")
            user_list = rotate_list(user_list)

            data = init_data(user_list)
            db_data = mg_db.get_data(update_db1)
            for i in range(len(data)):
                for j in db_data[i]['operators']:
                    data[i]['operators'].append(j)
                data[i] = {**data[i], "_id": ObjectId()}
                mg_db.update_data(data[i], update_db1)
                mg_db.push_manydata(data[i], push_db2)

            time.sleep(10)

        else:
            user_list = rotate_list(user_list)

            for i in range(5):
                data = {}
                db_data = mg_db.get_data(update_db1)
                print(db_data[i])
                data = loop_data(data, db_data, i, TOTAL_SECONDS)

                if db_data[i]['data'][0]['Battery'] != 0:
                    db_data[i]['data'][0]['Battery'] = db_data[i]['data'][0]['Battery']-0.035
                    db_data[i]['data'][0]['position']['lat'] = data['position'][0]
                    db_data[i]['data'][0]['position']['lng'] = data['position'][1]
                    db_data[i]['data'][0]['Wastetraystatus'] = data['wastetray']
                    db_data[i]['data'][0]['DistanceCovered'] = data['distance_cov']
                    db_data[i]['data'][0]['Status'] = status[1]
                    db_data[i]['data'][0]['Robotuptime'] = db_data[i]['data'][0]['Robotuptime']+TOTAL_SECONDS

                else:
                    db_data[i]['data'][0]['Status'] = status[2]

                db_data[i]['data'][0]['date'] = today
                db_data[i]['data'][0]['humidity'] = random.choice(humidity)
                db_data[i]['data'][0]['temp'] = random.choice(temperature)
                db_data[i]['data'][0]['tide'] = random.choice(tide)
                db_data[i]['operators'][0]['runtime'] = db_data[i]['operators'][0]['runtime']+TOTAL_SECONDS

                db_data[i] = {**db_data[i], "_id": ObjectId()}

                mg_db.update_data(db_data[i], update_db1)
                mg_db.push_manydata(db_data[i], push_db2)
                print("Data pushed for robot:", db_data[i])

                ###########################
                TOTAL_SECONDS = TOTAL_SECONDS + INTERVAL_SECONDS
            time.sleep(INTERVAL_SECONDS)

        # FLAG=True


if __name__ == "__main__":
    main()
