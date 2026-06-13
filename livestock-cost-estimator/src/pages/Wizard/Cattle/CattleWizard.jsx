import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { estimationApi } from '../../../api/estimationApi';
import toast from 'react-hot-toast';
import Step1Production from './steps/Step1Production';
import Step2Infrastructure from './steps/Step2Infrastructure';
import Step3Feed from './steps/Step3Feed';
import Step5HealthManagement from './steps/Step5HealthManagement';


export default function CattleWizard() {
  const navigate = useNavigate();
  const location = useLocation();
  const estimationId = location.state?.estimationId;
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    productionType: 'Beef',
    productionSystem: 'Intensive',
    numCattle: '',
    location: '',
    duration: '',
    hasHousing: 'yes',
    shelterValue: '',
    farmSize: '',
    waterSource: 'Borehole / Deep Well',
    buildingMaterial: 'Standard Steel',
    fencingType: 'Barbed Wire',
    accessibility: 'Yes, fully accessible',
    utilities: 'Yes',
    feedCost: '',
    supplementCost: '',
    grazingAvailability: false,
    initialWeight: '',
    targetWeight: '',
    milkYield: '',
    mortalityRate: 2.5,
    vaccineProgram: 'Standard',
    vetFrequency: 'Quarterly',
    parasiteControl: 'Regular',
    medicationIntensity: 'Medium',
    diseaseRisk: 'Medium',
    breedingMethods: { ai: true, natural: false, embryo: false },
    beefMarketAvg: false,
    beefPrice: '',
    beefYield: '',
    dairyMarketAvg: true,
    dairyPrice: '0.85',
    dairyPremium: '0.05'
  });

  const updateFormData = (newData) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleNextStep = async () => {
    if (!estimationId) {
      toast.error('Missing Estimation ID. Please start over.');
      navigate('/estimate');
      return;
    }
    try {
      setIsProcessing(true);
      
      if (currentStep === 1) {
        await estimationApi.saveProductionSetup(estimationId, {
          productionType: formData.productionType.toLowerCase(),
          productionSystem: formData.productionSystem.toLowerCase().replace(' system', ''),
          numberOfAnimals: parseInt(formData.numCattle, 10),
          location: formData.location,
          cycleDuration: parseInt(formData.duration, 10)
        });
      } else if (currentStep === 2) {
        const hasHousingBool = formData.hasHousing === 'yes' || formData.hasHousing === 'existing';
        
        let mappedHousingType = 'wooden';
        if (formData.buildingMaterial === 'Standard Steel') mappedHousingType = 'steel-structure';
        if (formData.buildingMaterial === 'Permanent Concrete') mappedHousingType = 'block-concrete';

        await estimationApi.saveHousing(estimationId, {
          hasHousing: hasHousingBool,
          housingStatus: hasHousingBool ? 'existing' : 'need-to-build',
          housingType: mappedHousingType,
          farmSize: parseFloat(formData.farmSize) || 0,
          waterSource: formData.waterSource,
          buildingMaterial: formData.buildingMaterial,
          fencingType: formData.fencingType
        });
      } else if (currentStep === 3) {
        await estimationApi.saveFeedAndMarket(estimationId, {
          laborCost: parseFloat(formData.laborCost) || 150000,
          electricityCost: parseFloat(formData.electricityCost) || 25000,
          feedPrice: parseFloat(formData.feedCost) || 0,
          supplementCost: parseFloat(formData.supplementCost) || 0,
          grazingAvailability: formData.grazingAvailability || false,
          sellingPricePerKg: parseFloat(formData.beefPrice) || parseFloat(formData.dairyPrice) || 0
        });
      }
      
      nextStep();
    } catch (error) {
      const errorMsg = error.response?.data?.msg || error.response?.data?.message || JSON.stringify(error.response?.data) || error.message;
      toast.error(`Validation Failed: ${errorMsg}`, { duration: 8000 });
      console.error("Full error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async () => {
    if (!estimationId) return;
    try {
      setIsProcessing(true);

      let mappedVetFreq = 'monthly';
      if (formData.vetFrequency === 'Weekly' || formData.vetFrequency === 'Regular (Weekly)') mappedVetFreq = 'weekly';
      if (formData.vetFrequency === 'Monthly' || formData.vetFrequency === 'Regular (Monthly)') mappedVetFreq = 'monthly';
      if (formData.vetFrequency === 'Quarterly' || formData.vetFrequency === 'Annually' || formData.vetFrequency === 'Emergency Only') mappedVetFreq = 'quarterly';

      await estimationApi.saveHealth(estimationId, {
        mortalityRate: parseFloat(formData.mortalityRate) || 2.5,
        vaccinationProgram: formData.vaccineProgram?.toLowerCase() || 'standard',
        vetServiceFrequency: mappedVetFreq,
        parasiteControl: formData.parasiteControl?.toLowerCase() || 'regular',
        medicationIntensity: formData.medicationIntensity?.toLowerCase() || 'medium'
      });
      
      const results = await estimationApi.calculate(estimationId);
      toast.success('Estimation calculated successfully!');
      navigate(`/estimate/results/${estimationId}`, { state: { results } });
    } catch (error) {
      const errorMsg = error.response?.data?.msg || error.response?.data?.message || JSON.stringify(error.response?.data) || error.message;
      toast.error(`Validation Failed: ${errorMsg}`, { duration: 8000 });
      console.error("Full error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const navItems = [
    { id: 1, name: 'Step 1: Basics', shortName: 'Basics' },
    { id: 2, name: 'Step 2: Infrastructure', shortName: 'Infrastructure' },
    { id: 3, name: 'Step 3: Feed & Nutrition', shortName: 'Feed' },
    { id: 4, name: 'Step 4: Health', shortName: 'Health' }
  ];

  const renderContent = () => {
    switch(currentStep) {
      case 1: return <Step1Production formData={formData} update={updateFormData} onNext={handleNextStep} onCancel={() => navigate('/estimate')} isProcessing={isProcessing} />;
      case 2: return <Step2Infrastructure formData={formData} update={updateFormData} onNext={handleNextStep} onBack={prevStep} isProcessing={isProcessing} />;
      case 3: return <Step3Feed formData={formData} update={updateFormData} onNext={handleNextStep} onBack={prevStep} isProcessing={isProcessing} />;
      case 4: return <Step5HealthManagement formData={formData} update={updateFormData} onSubmit={handleSubmit} onBack={prevStep} isProcessing={isProcessing} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-center px-6 shrink-0 z-10 sticky top-0">
          <div className="flex items-center gap-3">
             <span className="font-bold text-lg text-slate-900 tracking-tight">Cattle Estimation Wizard</span>
          </div>
      </header>
      <div className="flex flex-1 overflow-hidden relative max-w-[1400px] w-full mx-auto">
        <div className="w-72 bg-white border-r border-gray-200 flex flex-col pt-8 pb-6 shrink-0 hidden md:flex overflow-y-auto">
           <div className="px-6 mb-8">
              <div className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-3">Current Progress</div>
              <div className="flex items-end justify-between mb-2">
                 <span className="text-4xl font-extrabold text-green-500 leading-none">{Math.round((currentStep / 4) * 100)}%</span>
                 <span className="text-xs font-medium text-gray-400 mb-1">Step {currentStep} of 4</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                 <div className="h-full bg-green-500 transition-all duration-500 ease-out" style={{ width: `${(currentStep / 4) * 100}%`}}></div>
              </div>
           </div>

           <div className="px-4 flex-1">
              {navItems.map(item => (
                <div key={item.id} className={`flex items-center justify-between px-4 py-3 rounded-xl mb-1 cursor-pointer transition-colors ${currentStep === item.id ? 'bg-green-50 text-green-600 font-bold' : currentStep > item.id ? 'text-slate-700 hover:bg-gray-50 font-medium' : 'text-gray-400 font-medium'}`} onClick={() => currentStep > item.id && setCurrentStep(item.id)}>
                   <div className="flex items-center gap-3">
                      {currentStep > item.id ? (
                         <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ) : (
                         <div className={`w-1.5 h-1.5 rounded-full ${currentStep === item.id ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      )}
                      {item.name}
                   </div>
                </div>
              ))}
           </div>
        </div>
        <div className="flex-1 bg-white md:bg-transparent overflow-y-auto w-full relative">
           {renderContent()}
        </div>
      </div>
    </div>
  );
}
