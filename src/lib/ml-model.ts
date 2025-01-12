import * as tf from '@tensorflow/tfjs';

interface ConsultationFees {
  initial: number;
  followUp: number;
  emergency?: number;
  specialist?: number;
}

interface AnalysisResult {
  condition: string;
  probability: number;
  recommendations: string[];
  urgency: 'low' | 'medium' | 'high';
  medications: string[];
  consultationFees: ConsultationFees;
  specialistReferral?: string;
  estimatedRecoveryTime?: string;
  preventiveMeasures?: string[];
  lifestyle?: string[];
}

// Data: Symptoms
const symptoms = [
  'fever', 'cough', 'fatigue', 'difficulty_breathing', 'body_aches',
  'headache', 'sore_throat', 'loss_of_taste', 'nausea', 'diarrhea',
  'chills', 'rash', 'congestion', 'vomiting', 'chest_pain',
  'dizziness', 'sweating', 'muscle_weakness', 'joint_pain', 'runny_nose',
  'loss_of_smell', 'eye_pain', 'abdominal_pain', 'heart_palpitations', 'swollen_lymph_nodes',
  'weight_loss', 'appetite_loss', 'bleeding', 'shortness_of_breath', 'confusion',
  'insomnia', 'anxiety', 'depression', 'tremors', 'seizures',
  'blurred_vision', 'tinnitus', 'hearing_loss', 'numbness', 'tingling',
  'memory_loss', 'balance_problems', 'speech_difficulties', 'swelling', 'jaundice',
  'excessive_thirst', 'frequent_urination', 'night_sweats', 'hair_loss', 'brittle_nails',
  'mood_swings', 'hallucinations', 'paranoia', 'skin_discoloration', 'muscle_cramps',
  'back_pain', 'neck_pain', 'shoulder_pain', 'knee_pain', 'ankle_pain',
  'dry_mouth', 'irritability', 'low_energy', 'blisters', 'sun_sensitivity',
  'weak_pulse', 'fainting', 'cold_sensitivity', 'hot_flashes', 'pelvic_pain',
  'itching', 'burning_sensation', 'weight_gain', 'bruising', 'blood_in_stool',
  'blood_in_urine', 'yellow_eyes', 'difficulty_swallowing', 'red_eyes', 'persistent_cough',
  'delirium', 'loss_of_consciousness', 'hot_skin', 'cold_skin', 'shivering',
  'dark_urine', 'fatty_stools', 'bluish_skin', 'pale_skin', 'increased_hunger',
  'delayed_wound_healing', 'slow_growth', 'bone_pain', 'unsteady_gait', 'vision_loss',
  'sleep_apnea', 'urinary_incontinence', 'bloating', 'hives', 'increased_heart_rate',
  'low_blood_pressure', 'high_blood_pressure', 'sunken_eyes', 'enlarged_spleen', 'enlarged_liver',
  'cold_hands', 'cold_feet', 'difficulty_concentrating', 'dry_eyes', 'pink_eyes',
  'ringing_ears', 'irregular_heartbeat', 'unusual_cravings', 'frequent_infections', 'mouth_sores',
  'drooping_face', 'slurred_speech', 'clumsiness', 'nail_clubbing', 'painful_urination',
  'frequent_hiccups', 'loss_of_control', 'heat_intolerance', 'frequent_burping', 'spasms'
];

// Data: Diseases
// Data: Diseases
const diseases = [
  'Common Cold', 'COVID-19', 'Flu', 'Bronchitis', 'Pneumonia',
  'Allergies', 'Asthma', 'Migraine', 'Sinus Infection', 'Tuberculosis',
  'Malaria', 'Dengue', 'Gastroenteritis', 'Chronic Fatigue Syndrome', 'Meningitis',
  'Hypertension', 'Type 2 Diabetes', 'Anxiety Disorder', 'Depression',
  'Rheumatoid Arthritis', 'Osteoarthritis', 'Multiple Sclerosis',
  'Parkinsons Disease', 'Alzheimers Disease', 'Epilepsy',
  'Lupus', 'Fibromyalgia', 'Celiac Disease', 'Crohns Disease',
  'Ulcerative Colitis', 'Hypothyroidism', 'Hyperthyroidism',
  'Anemia', 'Psoriasis', 'Eczema', 'Skin Cancer', 'Lung Cancer',
  'Breast Cancer', 'Prostate Cancer', 'Leukemia', 'Lymphoma',
  'Hepatitis A', 'Hepatitis B', 'Hepatitis C', 'Chronic Kidney Disease',
  'Irritable Bowel Syndrome', 'Gout', 'Acid Reflux', 'Peptic Ulcer',
  'Endometriosis', 'Polycystic Ovary Syndrome (PCOS)', 'Ovarian Cyst',
  'Heart Disease', 'Stroke', 'Peripheral Artery Disease', 'Deep Vein Thrombosis',
  'Obesity', 'Insomnia', 'Sleep Apnea', 'Vertigo', 'HIV/AIDS',
  'Chikungunya', 'Zika Virus', 'Typhoid', 'Measles', 'Mumps',
  'Rubella', 'Chickenpox', 'Shingles', 'Scarlet Fever', 'Whooping Cough',
  'Huntingtons Disease', 'Amyotrophic Lateral Sclerosis (ALS)', 'Marfan Syndrome',
  'Hemophilia', 'Thalassemia', 'Sickle Cell Anemia', 'Vitamin D Deficiency',
  'Osteoporosis', 'Lymphedema', 'Raynaud’s Disease', 'Addison’s Disease',
  'Cystic Fibrosis', 'Panic Disorder', 'Obsessive-Compulsive Disorder (OCD)',
  'Bipolar Disorder', 'Schizophrenia', 'Panic Attacks', 'Autism Spectrum Disorder (ASD)'
];


// Data: Consultation Fees
const consultationFees: Record<string, ConsultationFees> = {
  'Common Cold': { initial: 300, followUp: 200, emergency: 800 },
  'COVID-19': { initial: 2000, followUp: 1000, emergency: 5000, specialist: 3500 },
  'Flu': { initial: 400, followUp: 250, emergency: 1000 },
  'Bronchitis': { initial: 450, followUp: 300, emergency: 1200, specialist: 2000 },
  'Pneumonia': { initial: 600, followUp: 400, emergency: 2500, specialist: 3000 },
  'Allergies': { initial: 350, followUp: 250, specialist: 1800 },
  'Asthma': { initial: 500, followUp: 350, emergency: 1500, specialist: 2500 },
  'Migraine': { initial: 400, followUp: 300, emergency: 1200, specialist: 2000 },
  'Sinus Infection': { initial: 350, followUp: 250, specialist: 1800 },
  'Tuberculosis': { initial: 5000, followUp: 2500, specialist: 6000 },
  'Malaria': { initial: 550, followUp: 400, emergency: 2000 },
  'Dengue': { initial: 6000, followUp: 4500, emergency: 8000, specialist: 7000 },
  'Gastroenteritis': { initial: 4500, followUp: 3000, emergency: 6000 },
  'Chronic Fatigue Syndrome': { initial: 6500, followUp: 4000, specialist: 7500 },
  'Meningitis': { initial: 8000, followUp: 6000, emergency: 12000, specialist: 10000 },
  'Hypertension': { initial: 3000, followUp: 1500, emergency: 5000, specialist: 4000 },
  'Type 2 Diabetes': { initial: 3500, followUp: 2000, specialist: 4500 },
  'Anxiety Disorder': { initial: 4000, followUp: 2500, specialist: 5000 },
  'Depression': { initial: 4000, followUp: 2500, specialist: 5000 },
  'Rheumatoid Arthritis': { initial: 5000, followUp: 3000, specialist: 6000 },
  'Osteoarthritis': { initial: 4500, followUp: 3000, specialist: 5500 },
  'Multiple Sclerosis': { initial: 6000, followUp: 4000, specialist: 7500 },
  'Parkinsons Disease': { initial: 7000, followUp: 5000, specialist: 8500 },
  'Alzheimers Disease': { initial: 8000, followUp: 6000, specialist: 10000 },
  'Epilepsy': { initial: 6000, followUp: 4000, emergency: 10000 },
  'Lupus': { initial: 5500, followUp: 3500, specialist: 6500 },
  'Fibromyalgia': { initial: 5000, followUp: 3000, specialist: 6000 },
  'Celiac Disease': { initial: 4000, followUp: 2500, specialist: 5000 },
  'Crohns Disease': { initial: 5500, followUp: 3500, specialist: 6500 },
  'Ulcerative Colitis': { initial: 5500, followUp: 3500, specialist: 6500 },
  'Hypothyroidism': { initial: 3000, followUp: 2000, specialist: 4500 },
  'Hyperthyroidism': { initial: 3000, followUp: 2000, specialist: 4500 },
  'Anemia': { initial: 2500, followUp: 1500, specialist: 3500 },
  'Psoriasis': { initial: 4000, followUp: 2500, specialist: 5000 },
  'Eczema': { initial: 3500, followUp: 2000, specialist: 4500 },
  'Skin Cancer': { initial: 10000, followUp: 7000, specialist: 15000 },
  'Lung Cancer': { initial: 15000, followUp: 10000, emergency: 20000, specialist: 18000 },
  'Breast Cancer': { initial: 12000, followUp: 8000, specialist: 16000 },
  'Prostate Cancer': { initial: 12000, followUp: 8000, specialist: 16000 },
  'Leukemia': { initial: 15000, followUp: 10000, specialist: 18000 },
  'Lymphoma': { initial: 14000, followUp: 9000, specialist: 17000 },
  'Hepatitis A': { initial: 5000, followUp: 3000, specialist: 7000 },
  'Hepatitis B': { initial: 6000, followUp: 4000, specialist: 8000 },
  'Hepatitis C': { initial: 7000, followUp: 5000, specialist: 9000 },
  'Chronic Kidney Disease': { initial: 9000, followUp: 6000, specialist: 12000 },
  'Irritable Bowel Syndrome': { initial: 4000, followUp: 2500, specialist: 5000 },
  'Gout': { initial: 4500, followUp: 3000, specialist: 5500 },
  'Acid Reflux': { initial: 3000, followUp: 2000, specialist: 4000 },
  'Peptic Ulcer': { initial: 4000, followUp: 2500, specialist: 5000 },
  'Endometriosis': { initial: 7000, followUp: 5000, specialist: 9000 },
  'Polycystic Ovary Syndrome (PCOS)': { initial: 6000, followUp: 4000, specialist: 8000 },
  'Ovarian Cyst': { initial: 5000, followUp: 3500, specialist: 7500 },
  'Heart Disease': { initial: 8000, followUp: 6000, emergency: 12000, specialist: 10000 },
  'Stroke': { initial: 10000, followUp: 7000, emergency: 15000 },
  'Peripheral Artery Disease': { initial: 7000, followUp: 5000, specialist: 9000 },
  'Deep Vein Thrombosis': { initial: 6000, followUp: 4000, specialist: 8000 },
  'Obesity': { initial: 3000, followUp: 2000, specialist: 4500 },
  'Insomnia': { initial: 4000, followUp: 2500, specialist: 5000 },
  'Sleep Apnea': { initial: 5000, followUp: 3500, specialist: 7500 },
  'Vertigo': { initial: 4000, followUp: 2500, specialist: 5000 },
  'HIV/AIDS': { initial: 10000, followUp: 7000, specialist: 15000 },
  'Chikungunya': { initial: 5000, followUp: 3500, emergency: 7000 },
  'Zika Virus': { initial: 5000, followUp: 3500, specialist: 7000 },
  'Typhoid': { initial: 6000, followUp: 4000, emergency: 8000 },
  'Measles': { initial: 4000, followUp: 2500, specialist: 5000 },
  'Mumps': { initial: 3500, followUp: 2000, specialist: 4500 },
  'Rubella': { initial: 3500, followUp: 2000, specialist: 4500 },
  'Chickenpox': { initial: 3000, followUp: 2000, specialist: 4000 },
  'Shingles': { initial: 4500, followUp: 3000, specialist: 5500 },
};

// Data: Medication Recommendations
const medicationRecommendations: Record<string, string[]> = {
  'Common Cold': [
    'Paracetamol for fever and pain relief',
    'Decongestants like pseudoephedrine',
    'Cough suppressants containing dextromethorphan',
    'Antihistamines for runny nose',
    'Zinc supplements to boost immune system',
    'Vitamin C supplements'
  ],
  'COVID-19': [
    'Paracetamol for fever',
    'Stay hydrated and rest',
    'Follow current medical guidelines',
    'Consult doctor for specific treatments',
    'Pulse oximeter monitoring',
    'Isolation protocols'
  ],
  'Hypertension': [
    'ACE inhibitors as prescribed',
    'Beta blockers if recommended',
    'Calcium channel blockers',
    'Regular blood pressure monitoring',
    'Low-sodium diet essential',
    'Lifestyle modifications'
  ],
  'Type 2 Diabetes': [
    'Metformin as prescribed',
    'Blood glucose monitoring',
    'Insulin if prescribed',
    'Strict dietary control',
    'Regular exercise routine',
    'Foot care essentials'
  ],
  'Anxiety Disorder': [
    'SSRIs if prescribed',
    'Anti-anxiety medications',
    'Therapy sessions',
    'Stress management techniques',
    'Lifestyle modifications',
    'Sleep hygiene practices'
  ],
  'Flu': [
    'Oseltamivir (Tamiflu) if prescribed',
    'Paracetamol or ibuprofen for fever',
    'Decongestants for nasal congestion',
    'Plenty of fluids and rest'
  ],
  'Bronchitis': [
    'Expectorants to help clear mucus',
    'Cough suppressants for sleep',
    'Bronchodilators if prescribed',
    'Steam inhalation'
  ],
  'Pneumonia': [
    'Prescribed antibiotics if bacterial',
    'Pain relievers for chest pain',
    'Cough medicine',
    'Immediate medical attention required'
  ],
  'Allergies': [
    'Antihistamines (e.g., cetirizine, loratadine)',
    'Nasal corticosteroids if prescribed',
    'Decongestants for blocked nose',
    'Avoid known allergens'
  ],
  'Asthma': [
    'Inhaled bronchodilators',
    'Prescribed corticosteroids',
    'Peak flow monitoring',
    'Follow asthma action plan'
  ],
  'Migraine': [
    'Pain relievers (ibuprofen, aspirin)',
    'Anti-migraine medications if prescribed',
    'Rest in a quiet, dark room',
    'Stay hydrated'
  ],
  'Sinus Infection': [
    'Saline nasal spray',
    'Decongestants',
    'Pain relievers',
    'Antibiotics if prescribed'
  ],
  'Tuberculosis': [
    'Prescribed TB medications only',
    'Complete full course of treatment',
    'Regular medical monitoring',
    'Immediate medical attention required'
  ],
  'Malaria': [
    'Prescribed antimalarial medications',
    'Fever reducers',
    'Immediate medical attention required',
    'Complete prescribed course'
  ],
  'Dengue': [
    'Paracetamol for fever (avoid aspirin)',
    'Plenty of fluids',
    'Rest and monitoring',
    'Immediate medical attention required'
  ],
  'Gastroenteritis': [
    'Oral rehydration solutions',
    'Anti-diarrheal medication if needed',
    'Bland diet (BRAT)',
    'Probiotics may help'
  ],
  'Chronic Fatigue Syndrome': [
    'Pain relievers as needed',
    'Sleep medications if prescribed',
    'Antidepressants if prescribed',
    'Professional medical supervision required'
  ],
  'Rheumatoid Arthritis': [
    'Nonsteroidal anti-inflammatory drugs (NSAIDs)',
    'Disease-modifying antirheumatic drugs (DMARDs)',
    'Biologic agents if prescribed',
    'Corticosteroids for flare-ups',
    'Physical therapy for joint mobility'
  ],
  'Osteoarthritis': [
    'Acetaminophen for pain relief',
    'NSAIDs for inflammation',
    'Topical analgesics',
    'Glucosamine supplements',
    'Physical therapy and exercise'
  ],
  'Multiple Sclerosis': [
    'Disease-modifying therapies (DMTs)',
    'Corticosteroids for relapses',
    'Muscle relaxants for spasms',
    'Pain relievers for neuropathic pain',
    'Lifestyle changes and physical therapy'
  ],
  'Parkinsons Disease': [
    'Levodopa/carbidopa',
    'Dopamine agonists',
    'MAO-B inhibitors',
    'Anticholinergics for tremors',
    'Physiotherapy for movement issues'
  ],
  'Alzheimers Disease': [
    'Cholinesterase inhibitors (e.g., donepezil)',
    'Memantine for moderate-to-severe stages',
    'Antidepressants or antipsychotics if prescribed',
    'Cognitive and behavioral therapies'
  ],
  'Epilepsy': [
    'Antiepileptic drugs (AEDs)',
    'Emergency treatment for seizures',
    'Lifestyle changes to avoid triggers',
    'Regular medical supervision'
  ],
  'Lupus': [
    'NSAIDs for joint pain',
    'Antimalarial drugs (e.g., hydroxychloroquine)',
    'Corticosteroids for inflammation',
    'Immunosuppressants if prescribed',
    'Regular medical monitoring'
  ],
  'Fibromyalgia': [
    'Pain relievers (e.g., acetaminophen)',
    'Antidepressants for symptom management',
    'Anti-seizure medications',
    'Physical therapy and stress management'
  ],
  'Celiac Disease': [
    'Strict gluten-free diet',
    'Nutritional supplements if needed',
    'Consultation with a dietitian',
    'Medical supervision for complications'
  ],
  'Crohns Disease': [
    'Anti-inflammatory medications (e.g., corticosteroids)',
    'Immunosuppressants',
    'Antibiotics for infections',
    'Dietary adjustments and nutritional supplements'
  ],
  'Ulcerative Colitis': [
    '5-aminosalicylic acid (5-ASA) medications',
    'Corticosteroids for flares',
    'Immunomodulators if prescribed',
    'Dietary changes and stress management'
  ],
  'Hypothyroidism': [
    'Levothyroxine (thyroid hormone replacement)',
    'Regular thyroid function tests',
    'Lifestyle adjustments as needed'
  ],
  'Hyperthyroidism': [
    'Antithyroid medications (e.g., methimazole)',
    'Beta-blockers for symptoms',
    'Radioactive iodine therapy',
    'Regular monitoring of thyroid levels'
  ],
  'Anemia': [
    'Iron supplements for iron-deficiency anemia',
    'Vitamin B12 supplements for pernicious anemia',
    'Folate supplements if needed',
    'Dietary changes to include iron-rich foods'
  ],
  'Psoriasis': [
    'Topical corticosteroids',
    'Vitamin D analogues (e.g., calcipotriol)',
    'Phototherapy (light therapy)',
    'Systemic medications for severe cases'
  ],
  'Eczema': [
    'Moisturizers for dry skin',
    'Topical corticosteroids for inflammation',
    'Antihistamines for itch relief',
    'Avoiding known irritants or allergens'
  ],
  'Glaucoma': [
    'Prescription eye drops (e.g., prostaglandin analogues)',
    'Beta-blockers for intraocular pressure',
    'Surgical options if necessary',
    'Regular eye check-ups'
  ],
  'Lung Cancer': [
    'Chemotherapy or targeted therapy',
    'Radiation therapy',
    'Immunotherapy if prescribed',
    'Palliative care for symptom management'
  ],
  'Breast Cancer': [
    'Hormonal therapy (e.g., tamoxifen)',
    'Chemotherapy as recommended',
    'Targeted therapy (e.g., HER2 inhibitors)',
    'Surgery or radiation therapy'
  ],
  'Prostate Cancer': [
    'Androgen deprivation therapy',
    'Radiation therapy',
    'Chemotherapy for advanced stages',
    'Active surveillance for early cases'
  ],
  'Hepatitis': [
    'Antiviral medications for hepatitis B or C',
    'Vaccination for hepatitis prevention',
    'Liver function monitoring',
    'Lifestyle changes to reduce liver strain'
  ],
  'Kidney Stones': [
    'Pain relievers for acute pain',
    'Alpha blockers to relax ureter muscles',
    'Increased fluid intake',
    'Lithotripsy or surgery if necessary'
  ],
  'Ovarian Cysts': [
    'Pain relievers for discomfort',
    'Hormonal birth control for prevention',
    'Surgical removal if cysts are large',
    'Regular monitoring via ultrasound'
  ],
  'UTI': [
    'Antibiotics as prescribed',
    'Increased water intake',
    'Urinary analgesics for pain relief',
    'Good personal hygiene practices'
  ],
  'Pancreatitis': [
    'Pain management in acute cases',
    'IV fluids and fasting for severe cases',
    'Enzyme supplements for chronic cases',
    'Lifestyle changes (e.g., alcohol cessation)'
  ],
  'Meningitis': [
    'Emergency medical attention required',
    'Prescribed antibiotics if bacterial',
    'Pain relief medication',
    'Hospital treatment necessary'
  ]
};


// Data: Severity Weights
const severityWeights: { [key: string]: number } = {
  fever: 0.6, cough: 0.4, fatigue: 0.3, difficulty_breathing: 0.8, body_aches: 0.3,
  headache: 0.3, sore_throat: 0.2, loss_of_taste: 0.4, nausea: 0.3, diarrhea: 0.4,
  chills: 0.4, rash: 0.3, congestion: 0.2, vomiting: 0.5, chest_pain: 0.7,
  dizziness: 0.4, sweating: 0.3, muscle_weakness: 0.4, joint_pain: 0.3, runny_nose: 0.2,
  loss_of_smell: 0.4, eye_pain: 0.3, abdominal_pain: 0.6, heart_palpitations: 0.7,
  swollen_lymph_nodes: 0.3, weight_loss: 0.6, appetite_loss: 0.5, bleeding: 0.8,
  shortness_of_breath: 0.8, confusion: 0.7, insomnia: 0.4, anxiety: 0.5, depression: 0.6,
  tremors: 0.7, seizures: 0.9, blurred_vision: 0.6, tinnitus: 0.4, hearing_loss: 0.5,
  numbness: 0.5, tingling: 0.4, memory_loss: 0.7, balance_problems: 0.7, speech_difficulties: 0.8,
  swelling: 0.4, jaundice: 0.8, excessive_thirst: 0.5, frequent_urination: 0.4, night_sweats: 0.5,
  hair_loss: 0.2, brittle_nails: 0.1, mood_swings: 0.5, hallucinations: 0.8, paranoia: 0.7,
  skin_discoloration: 0.3, muscle_cramps: 0.4, back_pain: 0.3, neck_pain: 0.3, shoulder_pain: 0.3,
  knee_pain: 0.3, ankle_pain: 0.3, dry_mouth: 0.2, irritability: 0.4, low_energy: 0.4,
  blisters: 0.3, sun_sensitivity: 0.3, weak_pulse: 0.6, fainting: 0.7, cold_sensitivity: 0.3,
  hot_flashes: 0.3, pelvic_pain: 0.5, itching: 0.3, burning_sensation: 0.4, weight_gain: 0.3,
  bruising: 0.4, blood_in_stool: 0.8, blood_in_urine: 0.8, yellow_eyes: 0.7, difficulty_swallowing: 0.7,
  red_eyes: 0.2, persistent_cough: 0.5, delirium: 0.8, loss_of_consciousness: 0.9, hot_skin: 0.4,
  cold_skin: 0.4, shivering: 0.4, dark_urine: 0.6, fatty_stools: 0.6, bluish_skin: 0.8,
  pale_skin: 0.6, increased_hunger: 0.3, delayed_wound_healing: 0.6, slow_growth: 0.5, bone_pain: 0.7,
  unsteady_gait: 0.7, vision_loss: 0.9, sleep_apnea: 0.7, urinary_incontinence: 0.6, bloating: 0.3,
  hives: 0.3, increased_heart_rate: 0.7, low_blood_pressure: 0.7, high_blood_pressure: 0.7,
  sunken_eyes: 0.6, enlarged_spleen: 0.6, enlarged_liver: 0.6, cold_hands: 0.3, cold_feet: 0.3,
  difficulty_concentrating: 0.4, dry_eyes: 0.2, pink_eyes: 0.2, ringing_ears: 0.4,
  irregular_heartbeat: 0.8, unusual_cravings: 0.4, frequent_infections: 0.6, mouth_sores: 0.4,
  drooping_face: 0.8, slurred_speech: 0.8, clumsiness: 0.5, nail_clubbing: 0.5, painful_urination: 0.6,
  frequent_hiccups: 0.3, loss_of_control: 0.8, heat_intolerance: 0.5, frequent_burping: 0.3, spasms: 0.6
};

// Model Creation and Management
let model: tf.LayersModel | null = null;

const createModel = () => {
  const model = tf.sequential();
  
  model.add(tf.layers.dense({
    inputShape: [symptoms.length],
    units: 256,
    activation: 'relu'
  }));
  
  model.add(tf.layers.dropout({ rate: 0.3 }));
  
  model.add(tf.layers.dense({
    units: 128,
    activation: 'relu'
  }));
  
  model.add(tf.layers.dropout({ rate: 0.2 }));
  
  model.add(tf.layers.dense({
    units: diseases.length,
    activation: 'softmax'
  }));

  return model;
};

async function initModel() {
  if (!model) {
    try {
      model = createModel();
      model.compile({
        optimizer: tf.train.adam(0.001),
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy']
      });
      
      const weights = model.getWeights();
      const initializedWeights = weights.map(w => 
        tf.randomNormal(w.shape, 0, 0.1)
      );
      model.setWeights(initializedWeights);
    } catch (error) {
      console.error('Error initializing model:', error);
      throw new Error('Failed to initialize symptom analysis model');
    }
  }
  return model;
}

// Utility Functions
function extractSymptoms(text: string): number[] {
  const lowercaseText = text.toLowerCase();
  return symptoms.map(symptom => 
    lowercaseText.includes(symptom.toLowerCase().replace('_', ' ')) ? 1 : 0
  );
}

function calculateSeverity(symptomVector: number[]): number {
  return symptoms.reduce((score, symptom, index) => 
    score + (symptomVector[index] * (severityWeights[symptom] || 0)), 0);
}

function generateRecommendations(condition: string, urgency: string): string[] {
  const medications = medicationRecommendations[condition] || [];
  const fees = consultationFees[condition];
  
  const baseRecommendations = [
    'Rest and stay hydrated',
    'Monitor your symptoms',
    ...medications
  ];

  const urgencyRecommendations: Record<string, string[]> = {
    high: [
      'Seek immediate medical attention',
      'Schedule an urgent consultation',
      `Initial consultation fee: KSH${fees.initial}`,
      `Emergency consultation fee: KSH${fees.emergency || fees.initial * 2}`,
      'Consider emergency care if symptoms worsen',
      fees.specialist ? `Specialist consultation available: KSH${fees.specialist}` : ''
    ],
    medium: [
      'Schedule a follow-up appointment',
      'Begin prescribed treatment plan',
      `Initial consultation fee: KSH${fees.initial}`,
      `Follow-up consultation fee: KSH${fees.followUp}`,
      fees.specialist ? `Specialist consultation available: KSH${fees.specialist}` : '',
      'Contact your doctor if symptoms persist'
    ],
    low: [
      'Continue normal activities with caution',
      'Use over-the-counter medications as listed above',
      'If symptoms persist beyond 5-7 days:',
      `  - Schedule a consultation (Fee: KSH${fees.initial})`,
      'Practice preventive measures'
    ]
  };

  return [...baseRecommendations, ...(urgencyRecommendations[urgency] || [])];
}

function getEstimatedRecoveryTime(condition: string, urgency: string): string {
  const recoveryTimes: Record<string, Record<string, string>> = {
    'Common Cold': {
      low: '3-7 days',
      medium: '7-10 days',
      high: '10-14 days'
    },
    'COVID-19': {
      low: '7-14 days',
      medium: '14-21 days',
      high: '21-30 days'
    }
  };

  return recoveryTimes[condition]?.[urgency] || 'Varies based on treatment adherence and response';
}

function getPreventiveMeasures(condition: string): string[] {
  const preventiveMeasures: Record<string, string[]> = {
    'Common Cold': [
      'Frequent hand washing',
      'Avoid close contact with infected individuals',
      'Maintain good sleep hygiene',
      'Stay warm and dry'
    ],
    'COVID-19': [
      'Wear masks in public spaces',
      'Maintain social distancing',
      'Regular hand sanitization',
      'Avoid crowded places',
      'Keep spaces well-ventilated'
    ],
    'Flu': [
      'Get vaccinated annually',
      'Wash hands regularly',
      'Avoid touching face',
      'Cover mouth and nose when sneezing',
      'Stay hydrated'
    ],
    'Bronchitis': [
      'Avoid smoking',
      'Stay away from air pollution',
      'Wash hands frequently',
      'Get vaccinated for flu and pneumonia',
      'Use a humidifier'
    ],
    'Pneumonia': [
      'Get vaccinated',
      'Avoid smoking',
      'Wash hands frequently',
      'Maintain good oral hygiene',
      'Eat a healthy diet'
    ],
    'Allergies': [
      'Avoid known allergens',
      'Keep indoor spaces clean',
      'Use air purifiers',
      'Wear masks during allergy season',
      'Take antihistamines as prescribed'
    ],
    'Asthma': [
      'Avoid exposure to allergens',
      'Use prescribed inhalers regularly',
      'Stay away from air pollution and smoke',
      'Keep up with vaccinations',
      'Monitor symptoms closely'
    ],
    'Migraine': [
      'Manage stress effectively',
      'Maintain a consistent sleep schedule',
      'Avoid known triggers (e.g., certain foods, bright lights)',
      'Stay hydrated',
      'Exercise regularly'
    ],
    'Sinus Infection': [
      'Avoid allergens and irritants',
      'Stay hydrated',
      'Use nasal sprays as recommended',
      'Avoid smoking',
      'Practice good hand hygiene'
    ],
    'Tuberculosis': [
      'Ensure proper ventilation in living spaces',
      'Avoid close contact with infected individuals',
      'Get vaccinated with BCG vaccine',
      'Adhere to prescribed treatments',
      'Maintain a healthy immune system'
    ],
    'Malaria': [
      'Use mosquito nets while sleeping',
      'Apply mosquito repellents',
      'Wear protective clothing',
      'Avoid stagnant water near living areas',
      'Take antimalarial medication as needed'
    ],
    'Dengue': [
      'Eliminate mosquito breeding grounds',
      'Use insect repellents',
      'Wear long-sleeved clothing',
      'Use mosquito nets',
      'Stay indoors during peak mosquito activity hours'
    ],
    'Gastroenteritis': [
      'Wash hands thoroughly before eating',
      'Avoid consuming contaminated food and water',
      'Practice good kitchen hygiene',
      'Stay hydrated',
      'Ensure proper food storage'
    ],
    'Chronic Fatigue Syndrome': [
      'Prioritize rest and relaxation',
      'Engage in light, consistent physical activity',
      'Manage stress effectively',
      'Eat a balanced diet',
      'Avoid overexertion'
    ],
    'Meningitis': [
      'Get vaccinated',
      'Avoid sharing personal items',
      'Practice good hygiene',
      'Stay away from infected individuals',
      'Seek immediate medical attention for symptoms'
    ],
    'Hypertension': [
      'Maintain a healthy weight',
      'Follow a low-sodium diet',
      'Engage in regular physical activity',
      'Manage stress effectively',
      'Avoid smoking and excessive alcohol consumption'
    ],
    'Type 2 Diabetes': [
      'Maintain a healthy weight',
      'Follow a balanced, low-sugar diet',
      'Exercise regularly',
      'Monitor blood glucose levels',
      'Avoid tobacco products'
    ],
    'Anxiety Disorder': [
      'Practice mindfulness and relaxation techniques',
      'Engage in regular physical activity',
      'Maintain a consistent sleep schedule',
      'Avoid excessive caffeine and alcohol',
      'Seek professional counseling if needed'
    ],
    'Depression': [
      'Engage in regular physical activity',
      'Stay connected with supportive individuals',
      'Maintain a consistent sleep schedule',
      'Eat a balanced diet',
      'Seek professional therapy or counseling'
    ],
    'Rheumatoid Arthritis': [
      'Engage in regular low-impact exercises',
      'Avoid smoking',
      'Maintain a healthy weight',
      'Follow prescribed treatment plans',
      'Eat an anti-inflammatory diet'
    ],
    'Osteoarthritis': [
      'Maintain a healthy weight',
      'Engage in low-impact exercises',
      'Avoid high-impact activities',
      'Manage joint stress',
      'Use proper posture and ergonomic supports'
    ],
    'Multiple Sclerosis': [
      'Maintain regular exercise',
      'Manage stress effectively',
      'Stay hydrated',
      'Avoid extreme heat',
      'Get adequate sleep'
    ],
    'Parkinsons Disease': [
      'Exercise regularly',
      'Eat a balanced diet',
      'Avoid smoking and excessive alcohol consumption',
      'Engage in mental exercises',
      'Seek support for mobility aids'
    ],
    'Alzheimers Disease': [
      'Engage in regular cognitive exercises',
      'Maintain physical activity',
      'Eat a brain-healthy diet',
      'Stay socially active',
      'Control cardiovascular risk factors'
    ],
    'Epilepsy': [
      'Take prescribed medications regularly',
      'Avoid known seizure triggers',
      'Get enough sleep',
      'Manage stress',
      'Stay hydrated'
    ],
    'Lupus': [
      'Avoid sun exposure',
      'Take prescribed medications',
      'Exercise regularly',
      'Follow a balanced diet',
      'Get regular health check-ups'
    ],
    'Fibromyalgia': [
      'Manage stress',
      'Exercise regularly',
      'Get adequate rest',
      'Avoid overexertion',
      'Eat a balanced, anti-inflammatory diet'
    ],
    'Celiac Disease': [
      'Avoid gluten-containing foods',
      'Follow a gluten-free diet strictly',
      'Read food labels carefully',
      'Seek regular medical check-ups',
      'Be cautious of cross-contamination'
    ],
    'Crohns Disease': [
      'Eat a balanced diet',
      'Avoid smoking',
      'Manage stress',
      'Take medications as prescribed',
      'Stay hydrated'
    ],
    'Ulcerative Colitis': [
      'Eat a healthy, balanced diet',
      'Avoid triggers (e.g., high-fat, spicy foods)',
      'Take medications as prescribed',
      'Manage stress',
      'Stay hydrated'
    ],
    'Hypothyroidism': [
      'Take thyroid medication as prescribed',
      'Monitor thyroid function regularly',
      'Maintain a healthy diet',
      'Exercise regularly',
      'Manage stress'
    ],
    'Hyperthyroidism': [
      'Take prescribed medications',
      'Avoid excessive iodine intake',
      'Monitor thyroid function regularly',
      'Engage in regular physical activity',
      'Manage stress'
    ],
    'Anemia': [
      'Eat iron-rich foods',
      'Take iron supplements if prescribed',
      'Avoid excessive tea or coffee with meals',
      'Maintain a healthy diet',
      'Stay hydrated'
    ],
    'Psoriasis': [
      'Avoid skin irritants',
      'Maintain a healthy skin care routine',
      'Use prescribed topical treatments',
      'Stay hydrated',
      'Manage stress'
    ],
    'Eczema': [
      'Avoid skin irritants and allergens',
      'Use moisturizing lotions regularly',
      'Avoid scratching',
      'Use prescribed treatments',
      'Keep the skin clean and hydrated'
    ],
    'Skin Cancer': [
      'Avoid excessive sun exposure',
      'Wear sunscreen regularly',
      'Check skin regularly for abnormalities',
      'Seek regular skin check-ups',
      'Wear protective clothing'
    ],
    'Lung Cancer': [
      'Avoid smoking and secondhand smoke',
      'Follow a healthy diet',
      'Engage in regular physical activity',
      'Avoid exposure to harmful chemicals',
      'Get regular health check-ups'
    ],
    'Breast Cancer': [
      'Get regular mammograms',
      'Maintain a healthy weight',
      'Exercise regularly',
      'Limit alcohol intake',
      'Avoid smoking'
    ],
    'Prostate Cancer': [
      'Get regular prostate exams',
      'Maintain a healthy diet',
      'Exercise regularly',
      'Limit alcohol intake',
      'Avoid smoking'
    ],
    'Leukemia': [
      'Avoid known carcinogens',
      'Maintain a healthy lifestyle',
      'Stay up to date on vaccinations',
      'Avoid exposure to harmful chemicals',
      'Seek medical advice if symptoms occur'
    ],
    'Lymphoma': [
      'Avoid known carcinogens',
      'Maintain a healthy lifestyle',
      'Get regular check-ups',
      'Stay up to date on vaccinations',
      'Avoid exposure to harmful chemicals'
    ],
    'Hepatitis A': [
      'Get vaccinated for Hepatitis A',
      'Practice good hand hygiene',
      'Avoid drinking contaminated water',
      'Avoid consuming unclean food',
      'Get regular health check-ups'
    ],
    'Hepatitis B': [
      'Get vaccinated for Hepatitis B',
      'Avoid sharing needles or personal items',
      'Practice safe sex',
      'Get regular liver function tests',
      'Avoid alcohol and excessive medications'
    ],
    'Hepatitis C': [
      'Avoid sharing needles',
      'Get tested for Hepatitis C',
      'Avoid alcohol and excessive medications',
      'Practice safe sex',
      'Get regular liver function tests'
    ],
    'Chronic Kidney Disease': [
      'Manage blood pressure',
      'Monitor blood sugar levels',
      'Avoid smoking and excessive alcohol consumption',
      'Eat a kidney-friendly diet',
      'Stay hydrated'
    ],
    'Irritable Bowel Syndrome': [
      'Eat a balanced diet',
      'Avoid triggers (e.g., high-fat foods)',
      'Exercise regularly',
      'Manage stress',
      'Stay hydrated'
    ],
    'Gout': [
      'Limit alcohol intake',
      'Avoid foods high in purines',
      'Maintain a healthy weight',
      'Drink plenty of water',
      'Take medications as prescribed'
    ],
    'Acid Reflux': [
      'Avoid large meals and lying down after eating',
      'Eat smaller, more frequent meals',
      'Avoid trigger foods',
      'Maintain a healthy weight',
      'Elevate the head of the bed'
    ],
    'Peptic Ulcer': [
      'Avoid spicy foods',
      'Limit alcohol intake',
      'Quit smoking',
      'Take medications as prescribed',
      'Eat smaller, more frequent meals'
    ],
    'Endometriosis': [
      'Manage stress',
      'Exercise regularly',
      'Eat a balanced diet',
      'Take medications as prescribed',
      'Consider fertility treatment if needed'
    ],
    'Polycystic Ovary Syndrome (PCOS)': [
      'Maintain a healthy weight',
      'Exercise regularly',
      'Eat a balanced diet',
      'Take medications as prescribed',
      'Manage stress'
    ],
    'Ovarian Cyst': [
      'Monitor symptoms',
      'Follow up with healthcare provider regularly',
      'Exercise regularly',
      'Eat a balanced diet',
      'Take prescribed medications'
    ],
    'Heart Disease': [
      'Maintain a healthy weight',
      'Exercise regularly',
      'Follow a heart-healthy diet',
      'Avoid smoking',
      'Manage stress'
    ],
    'Stroke': [
      'Control blood pressure',
      'Maintain a healthy weight',
      'Exercise regularly',
      'Avoid smoking and excessive alcohol',
      'Eat a healthy diet'
    ],
    'Peripheral Artery Disease': [
      'Exercise regularly',
      'Maintain a healthy weight',
      'Control blood pressure and cholesterol levels',
      'Quit smoking',
      'Eat a healthy diet'
    ],
    'Deep Vein Thrombosis': [
      'Stay active and exercise regularly',
      'Avoid prolonged sitting or standing',
      'Wear compression stockings',
      'Take blood-thinning medications if prescribed',
      'Drink plenty of water'
    ],
    'Obesity': [
      'Maintain a healthy weight',
      'Exercise regularly',
      'Eat a balanced diet',
      'Get enough sleep',
      'Manage stress'
    ],
    'Insomnia': [
      'Maintain a consistent sleep schedule',
      'Create a calming bedtime routine',
      'Avoid caffeine and heavy meals before bed',
      'Create a comfortable sleep environment',
      'Exercise regularly'
    ],
    'Sleep Apnea': [
      'Maintain a healthy weight',
      'Sleep on your side',
      'Avoid alcohol and sedatives before sleep',
      'Use CPAP machine as prescribed',
      'Avoid smoking'
    ],
    'Vertigo': [
      'Practice balance exercises',
      'Avoid sudden head movements',
      'Stay hydrated',
      'Avoid alcohol',
      'Seek medical attention if symptoms persist'
    ],
    'HIV/AIDS': [
      'Practice safe sex',
      'Get tested regularly',
      'Take antiretroviral medications as prescribed',
      'Avoid sharing needles',
      'Maintain a healthy lifestyle'
    ],
    'Chikungunya': [
      'Use mosquito repellents',
      'Wear protective clothing',
      'Eliminate mosquito breeding sites',
      'Stay indoors during peak mosquito activity hours',
      'Use mosquito nets'
    ],
    'Zika Virus': [
      'Use mosquito repellents',
      'Wear protective clothing',
      'Eliminate mosquito breeding grounds',
      'Avoid travel to areas with outbreaks',
      'Use mosquito nets'
    ],
    'Typhoid': [
      'Drink safe water',
      'Eat food from hygienic sources',
      'Practice good hand hygiene',
      'Get vaccinated for Typhoid',
      'Avoid unclean water'
    ],
    'Measles': [
      'Get vaccinated for measles',
      'Avoid close contact with infected individuals',
      'Practice good hand hygiene',
      'Stay up-to-date on vaccinations',
      'Seek medical attention if symptoms develop'
    ],
    'Mumps': [
      'Get vaccinated for mumps',
      'Avoid sharing personal items',
      'Practice good hand hygiene',
      'Isolate infected individuals',
      'Seek medical attention if symptoms develop'
    ],
    'Rubella': [
      'Get vaccinated for rubella',
      'Avoid exposure to infected individuals',
      'Practice good hand hygiene',
      'Stay up to date on vaccinations',
      'Seek medical attention if symptoms occur'
    ],
    'Chickenpox': [
      'Get vaccinated for chickenpox',
      'Avoid scratching the rash',
      'Isolate infected individuals',
      'Practice good hand hygiene',
      'Use anti-itch treatments as prescribed'
    ],
    'Shingles': [
      'Get vaccinated for shingles',
      'Avoid contact with people who have weakened immune systems',
      'Practice good hand hygiene',
      'Avoid scratching the rash',
      'Use prescribed antiviral medications'
    ],
    'Scarlet Fever': [
      'Get treatment for strep throat promptly',
      'Practice good hand hygiene',
      'Avoid close contact with infected individuals',
      'Seek medical attention if symptoms occur',
      'Isolate infected individuals'
    ],
    'Whooping Cough': [
      'Get vaccinated for whooping cough',
      'Avoid close contact with infected individuals',
      'Practice good hand hygiene',
      'Isolate infected individuals',
      'Get treatment if symptoms occur'
    ],
    'Huntingtons Disease': [
      'Genetic counseling',
      'Regular check-ups',
      'Stay active mentally and physically',
      'Seek family support',
      'Manage symptoms with prescribed treatments'
    ],
    'Amyotrophic Lateral Sclerosis (ALS)': [
      'Seek early diagnosis and support',
      'Maintain muscle strength through exercise',
      'Consider physical therapy',
      'Maintain a balanced diet',
      'Seek supportive care'
    ],
    'Marfan Syndrome': [
      'Monitor cardiovascular health',
      'Avoid excessive physical exertion',
      'Take prescribed medications',
      'Get regular check-ups',
      'Maintain a healthy lifestyle'
    ],
    'Hemophilia': [
      'Avoid injury or trauma',
      'Take prescribed clotting factor treatments',
      'Practice safe activities',
      'Monitor for signs of bleeding',
      'Stay up to date on medical care'
    ],
    'Thalassemia': [
      'Regular blood transfusions if necessary',
      'Take iron chelation therapy',
      'Maintain a healthy diet',
      'Get regular check-ups',
      'Avoid excessive iron intake'
    ],
    'Sickle Cell Anemia': [
      'Stay hydrated',
      'Avoid temperature extremes',
      'Avoid high altitudes',
      'Take prescribed pain management',
      'Follow up with regular medical check-ups'
    ],
    'Vitamin D Deficiency': [
      'Get regular sun exposure',
      'Consume vitamin D-rich foods',
      'Take vitamin D supplements if prescribed',
      'Avoid excessive use of sunscreen',
      'Get blood tests to monitor vitamin D levels'
    ],
    'Osteoporosis': [
      'Consume calcium-rich foods',
      'Engage in weight-bearing exercises',
      'Take prescribed calcium and vitamin D supplements',
      'Avoid smoking',
      'Avoid excessive alcohol consumption'
    ],
    'Lymphedema': [
      'Engage in lymphatic massage',
      'Maintain a healthy weight',
      'Wear compression garments as prescribed',
      'Avoid injury to affected areas',
      'Seek regular medical advice'
    ],
    'Raynaud’s Disease': [
      'Avoid cold temperatures',
      'Manage stress',
      'Wear warm gloves and socks',
      'Avoid smoking',
      'Exercise regularly'
    ],
    'Addison’s Disease': [
      'Take prescribed corticosteroids',
      'Monitor for symptoms of low blood pressure',
      'Avoid stress',
      'Eat a balanced diet',
      'Get regular check-ups'
    ],
    'Cystic Fibrosis': [
      'Take prescribed medications',
      'Engage in regular physical activity',
      'Maintain good nutrition',
      'Use prescribed chest physiotherapy',
      'Get regular medical check-ups'
    ],
    'Panic Disorder': [
      'Practice relaxation techniques',
      'Avoid caffeine and alcohol',
      'Seek therapy',
      'Exercise regularly',
      'Avoid stress triggers'
    ],
    'Obsessive-Compulsive Disorder (OCD)': [
      'Engage in cognitive-behavioral therapy',
      'Avoid stress triggers',
      'Take prescribed medications',
      'Practice mindfulness',
      'Maintain a consistent routine'
    ],
    'Bipolar Disorder': [
      'Follow prescribed medication regimen',
      'Engage in therapy',
      'Maintain a stable sleep routine',
      'Avoid stress',
      'Stay active physically and socially'
    ],
    'Schizophrenia': [
      'Take prescribed antipsychotic medications',
      'Engage in therapy',
      'Stay connected with support systems',
      'Maintain a healthy routine',
      'Avoid drugs and alcohol'
    ],
    'Panic Attacks': [
      'Practice relaxation techniques',
      'Avoid stress triggers',
      'Seek professional counseling',
      'Maintain a healthy lifestyle',
      'Use prescribed medications if necessary'
    ],
    'Autism Spectrum Disorder (ASD)': [
      'Engage in early intervention therapies',
      'Provide structured routines',
      'Encourage social interaction',
      'Support sensory processing needs',
      'Maintain consistent communication'
    ]
  }; 

  return preventiveMeasures[condition] || ['Maintain good hygiene', 'Follow doctor\'s recommendations'];
}

function getLifestyleRecommendations(condition: string): string[] {
  const lifestyleRecommendations: Record<string, string[]> = {
    'Hypertension': [
      'Regular exercise (30 minutes daily)',
      'Reduce salt intake',
      'Maintain healthy weight',
      'Limit alcohol consumption',
      'Practice stress management'
    ],
    'Type 2 Diabetes': [
      'Regular blood sugar monitoring',
      'Balanced diet with controlled carbs',
      'Regular physical activity',
      'Weight management',
      'Foot care routine'
    ]
  };

  return lifestyleRecommendations[condition] || ['Maintain a balanced diet', 'Regular exercise', 'Adequate rest'];
}

function shouldReferToSpecialist(condition: string, severityScore: number): boolean {
  const specialistConditions = [
    'HIV/AIDS', 'Tuberculosis', 'Meningitis', 'Multiple Sclerosis', 'Lupus',
    'Rheumatoid Arthritis', 'Parkinsons Disease', 'Alzheimers Disease', 'Epilepsy',
    'Lung Cancer', 'Breast Cancer', 'Prostate Cancer', 'Leukemia', 'Lymphoma',
    'Chronic Kidney Disease', 'Hepatitis B', 'Hepatitis C', 'Cystic Fibrosis',
    'Hemophilia', 'Thalassemia', 'Sickle Cell Anemia', 'Marfan Syndrome',
    'Amyotrophic Lateral Sclerosis (ALS)', 'Huntingtons Disease', 'Osteoporosis',
    'Endometriosis', 'Polycystic Ovary Syndrome (PCOS)', 'Ovarian Cyst',
    'Heart Disease', 'Stroke', 'Peripheral Artery Disease', 'Deep Vein Thrombosis'
  ];
  return specialistConditions.includes(condition) || severityScore > 0.8;
}

function getSpecialistType(condition: string): string {
  const specialistMap: Record<string, string> = {
    'Tuberculosis': 'Pulmonologist',
    'Meningitis': 'Neurologist',
    'Multiple Sclerosis': 'Neurologist',
    'Lupus': 'Rheumatologist',
    'Rheumatoid Arthritis': 'Rheumatologist',
    'Parkinsons Disease': 'Neurologist',
    'Alzheimers Disease': 'Neurologist',
    'HIV/AIDS': 'Infectious Disease Specialist',
    'Epilepsy': 'Neurologist',
    'Lung Cancer': 'Oncologist',
    'Breast Cancer': 'Oncologist',
    'Prostate Cancer': 'Oncologist',
    'Leukemia': 'Hematologist/Oncologist',
    'Lymphoma': 'Hematologist/Oncologist',
    'Chronic Kidney Disease': 'Nephrologist',
    'Hepatitis B': 'Hepatologist',
    'Hepatitis C': 'Hepatologist',
    'Cystic Fibrosis': 'Pulmonologist',
    'Hemophilia': 'Hematologist',
    'Thalassemia': 'Hematologist',
    'Sickle Cell Anemia': 'Hematologist',
    'Marfan Syndrome': 'Geneticist',
    'Amyotrophic Lateral Sclerosis (ALS)': 'Neurologist',
    'Huntingtons Disease': 'Neurologist',
    'Osteoporosis': 'Endocrinologist',
    'Endometriosis': 'Gynecologist',
    'Polycystic Ovary Syndrome (PCOS)': 'Gynecologist',
    'Ovarian Cyst': 'Gynecologist',
    'Heart Disease': 'Cardiologist',
    'Stroke': 'Neurologist',
    'Peripheral Artery Disease': 'Vascular Surgeon',
    'Deep Vein Thrombosis': 'Vascular Surgeon',
    'Obesity': 'Endocrinologist',
    'Insomnia': 'Sleep Specialist',
    'Sleep Apnea': 'Sleep Specialist',
    'Vertigo': 'Otolaryngologist (ENT)',
    'Chikungunya': 'Infectious Disease Specialist',
    'Zika Virus': 'Infectious Disease Specialist',
    'Typhoid': 'Infectious Disease Specialist',
    'Measles': 'Pediatrician',
    'Mumps': 'Pediatrician',
    'Rubella': 'Pediatrician',
    'Chickenpox': 'Pediatrician',
    'Shingles': 'Dermatologist',
    'Scarlet Fever': 'Pediatrician',
    'Whooping Cough': 'Pediatrician',
    'Vitamin D Deficiency': 'Endocrinologist',
    'Raynaud’s Disease': 'Rheumatologist',
    'Addison’s Disease': 'Endocrinologist',
    'Panic Disorder': 'Psychiatrist',
    'Obsessive-Compulsive Disorder (OCD)': 'Psychiatrist',
    'Bipolar Disorder': 'Psychiatrist',
    'Schizophrenia': 'Psychiatrist',
    'Panic Attacks': 'Psychiatrist',
    'Autism Spectrum Disorder (ASD)': 'Developmental Pediatrician'
  };

  return specialistMap[condition] || 'Relevant Specialist';
}

// Main Analysis Function
export async function analyzeSymptoms(symptomText: string): Promise<AnalysisResult> {
  try {
    const model = await initModel();
    const symptomVector = extractSymptoms(symptomText);
    const inputTensor = tf.tensor2d([symptomVector], [1, symptoms.length]);
    const prediction = model.predict(inputTensor) as tf.Tensor;
    const probabilities = await prediction.data();
    const maxIndex = Array.from(probabilities).indexOf(Math.max(...Array.from(probabilities)));
    const condition = diseases[maxIndex];
    const probability = probabilities[maxIndex];
    const severityScore = calculateSeverity(symptomVector);
    
    let urgency: 'low' | 'medium' | 'high';
    if (severityScore > 0.7) urgency = 'high';
    else if (severityScore > 0.4) urgency = 'medium';
    else urgency = 'low';

    const recommendations = generateRecommendations(condition, urgency);
    const medications = medicationRecommendations[condition] || [];
    const fees = consultationFees[condition];

    tf.dispose([inputTensor, prediction]);

    const result: AnalysisResult = {
      condition,
      probability,
      recommendations,
      urgency,
      medications,
      consultationFees: fees,
      estimatedRecoveryTime: getEstimatedRecoveryTime(condition, urgency),
      preventiveMeasures: getPreventiveMeasures(condition),
      lifestyle: getLifestyleRecommendations(condition)
    };

    if (shouldReferToSpecialist(condition, severityScore)) {
      result.specialistReferral = getSpecialistType(condition);
    }

    return result;
  } catch (error) {
    console.error('Error analyzing symptoms:', error);
    throw new Error('Failed to analyze symptoms');
  }
}