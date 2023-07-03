import pandas as pd
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Read the Excel data into a DataFrame

data = pd.read_excel("backend/demen.xlsx")


# Define the diagnostic criteria and dementia ranges
mmse_cutoff = 24
cdr_cutoff = 0.5

@app.route("/diagnose", methods=["POST"])
def diagnose():
    # Retrieve data from the frontend
    global data
    
   
  
    request_data = request.get_json()
    mmse_score = request_data["mmseScore"]
    cdr_score = request_data["cdrScore"]
    symptoms = request_data["symptoms"]

    # Check if the patient exists in the dataset
    filtered_data = data[(data["MMSE"] == mmse_score) & (data["CDR"] == cdr_score)]
    if not filtered_data.empty:
        diagnosis = filtered_data.iloc[0]["Diagnosis"]
        dementia_range = filtered_data.iloc[0]["Dementia Range"]
    else:
        # Check for dementia diagnosis
        if (mmse_score <= mmse_cutoff or cdr_score >= cdr_cutoff) and any(symptoms.values()):
            diagnosis = "Dementia"
        else:
            diagnosis = "No Dementia"

        # Determine dementia range
        if mmse_score >= 24 and cdr_score > 0:
            dementia_range = "Very Mild Dementia"
        elif mmse_score >= 24 and cdr_score <= 0:
            dementia_range = "No Dementia"
        elif 20 <= mmse_score <= 23 and cdr_score >= cdr_cutoff:
            dementia_range = "Mild Dementia"
        elif 10 <= mmse_score <= 19 and cdr_score >= cdr_cutoff:
            dementia_range = "Moderate Dementia"
        elif mmse_score < 10:
            dementia_range = "Severe Dementia"
        else:
            dementia_range = "Not Applicable"

        # Add new data to the Excel sheet
        new_data = pd.DataFrame(
            {
                "MMSE": [mmse_score],
                "CDR": [cdr_score],
                "Diagnosis": [diagnosis],
                "Dementia Range": [dementia_range],
            }
        )
        data = pd.concat([data, new_data], ignore_index=True)
        data.to_excel("demen.xlsx", index=False)

    # Prepare response data
    response_data = {
        "diagnosis": diagnosis,
        "dementiaRange": dementia_range,
        "positiveSymptoms": [symptom for symptom, value in symptoms.items() if value]
    }
    print(diagnosis)
    print(response_data)

    return jsonify(response_data)


if __name__ == "__main__":
    app.run()
