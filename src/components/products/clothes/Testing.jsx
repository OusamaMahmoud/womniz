import React, { useState } from 'react';

const Testing = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    step1: { field1: '', field2: '' },
    step2: { field3: '', field4: '' },
    step3: { field5: '', field6: '' },
    step4: { field7: '', field8: '', images: [] },
  });

  const handleChange = (step, e) => {
    setFormData({
      ...formData,
      [step]: {
        ...formData[step],
        [e.target.name]: e.target.value,
      },
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const imagePreviews = files.map(file => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      return new Promise((resolve) => {
        reader.onload = () => {
          resolve({ file, preview: reader.result });
        };
      });
    });

    Promise.all(imagePreviews).then(images => {
      setFormData(prevData => ({
        ...prevData,
        step4: {
          ...prevData.step4,
          images: [...prevData.step4.images, ...images],
        },
      }));
    });
  };

  const removeImage = (index) => {
    setFormData(prevData => ({
      ...prevData,
      step4: {
        ...prevData.step4,
        images: prevData.step4.images.filter((_, i) => i !== index),
      },
    }));
  };

  const nextStep = () => {
    setCurrentStep((prevStep) => Math.min(prevStep + 1, 4));
  };

  const prevStep = () => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 1));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // Handle form submission
  };

  return (
    <div>
      <div>
        {currentStep === 1 && (
          <div>
            <h2>Step 1</h2>
            <input
              type="text"
              name="field1"
              value={formData.step1.field1}
              onChange={(e) => handleChange('step1', e)}
            />
            <input
              type="text"
              name="field2"
              value={formData.step1.field2}
              onChange={(e) => handleChange('step1', e)}
            />
          </div>
        )}
        {currentStep === 2 && (
          <div>
            <h2>Step 2</h2>
            <input
              type="text"
              name="field3"
              value={formData.step2.field3}
              onChange={(e) => handleChange('step2', e)}
            />
            <input
              type="text"
              name="field4"
              value={formData.step2.field4}
              onChange={(e) => handleChange('step2', e)}
            />
          </div>
        )}
        {currentStep === 3 && (
          <div>
            <h2>Step 3</h2>
            <input
              type="text"
              name="field5"
              value={formData.step3.field5}
              onChange={(e) => handleChange('step3', e)}
            />
            <input
              type="text"
              name="field6"
              value={formData.step3.field6}
              onChange={(e) => handleChange('step3', e)}
            />
          </div>
        )}
        {currentStep === 4 && (
          <div>
            <h2>Step 4</h2>
            <div>
                <p>input 1</p>
                <input
                className='input input-bordered'
                  type="text"
                  name="field7"
                  value={formData.step4.field7}
                  onChange={(e) => handleChange('step4', e)}
                />
            </div>
            <input
              type="text"
              name="field8"
              value={formData.step4.field8}
              onChange={(e) => handleChange('step4', e)}
            />
            <input
              type="file"
              multiple
              onChange={handleImageChange}
            />
            <div>
              {formData.step4.images.map((image, index) => (
                <div key={index}>
                  <img src={image.preview} alt={`Preview ${index}`} width="100" />
                  <button type="button" onClick={() => removeImage(index)}>Remove</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div>
        {currentStep > 1 && <button onClick={prevStep}>Previous</button>}
        {currentStep < 4 && <button onClick={nextStep}>Next</button>}
        {currentStep === 4 && <button onClick={handleSubmit}>Submit</button>}
      </div>
    </div>
  );
};

export default Testing;
