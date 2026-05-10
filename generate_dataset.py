import pandas as pd
import random
import os

if not os.path.exists("dataset"):
    os.makedirs("dataset")

data = []

for i in range(5000):
    # Aligning with Mongoose Enums
    livestockType = random.choice(["cattle", "poultry"])
    
    if livestockType == "cattle":
        productionType = random.choice(["beef", "dairy"])
        productionSystem = random.choice(["intensive", "semi-intensive", "extensive"])
        cycleDuration = random.randint(12, 36) # Months
    else: # poultry
        productionType = random.choice(["broiler", "layer"])
        productionSystem = random.choice(["deep litter", "battery cage", "intensive"])
        cycleDuration = random.randint(6, 80) # Weeks

    numberOfAnimals = random.randint(10, 500)
    location = random.choice(["South-West", "North-Central", "South-East", "North-West"])
    housingType = random.choice(["basic", "standard", "premium"])
    vaccinationProgram = random.choice(["minimal", "standard", "intensive"])
    vetServiceFrequency = random.choice(["weekly", "monthly", "quarterly"])
    medicationIntensity = random.choice(["low", "medium", "high"])

    # Simulated operational costs (per month/unit)
    feedPrice = random.randint(15000, 50000)
    laborCost = random.randint(10000, 100000)
    electricityCost = random.randint(5000, 30000)

    # The AI Target: Total Cost Estimation 
    # (A simple formula the AI will learn to approximate)
    totalCostEstimation = (feedPrice * 2) + laborCost + electricityCost + (numberOfAnimals * 500)

    data.append([
        livestockType, productionType, productionSystem, numberOfAnimals, 
        cycleDuration, location, housingType, vaccinationProgram, 
        vetServiceFrequency, medicationIntensity, feedPrice, 
        laborCost, electricityCost, totalCostEstimation
    ])

headers = [
    "livestockType", "productionType", "productionSystem", "numberOfAnimals",
    "cycleDuration", "location", "housingType", "vaccinationProgram",
    "vetServiceFrequency", "medicationIntensity", "feedPrice", 
    "laborCost", "electricityCost", "totalCostEstimation"
]

df = pd.DataFrame(data, columns=headers)
df.to_csv("dataset/livestock_data.csv", index=False)
print("Dataset generated to match Mongoose Schema!")