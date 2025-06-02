import React, { useRef, useState ,useEffect} from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import logo from '../assets/images.jpg';



export default function MescomReportForm() {
  const printRef = useRef();

  const [data, setData] = useState({
    pageno:'',
    place: '',
    capacity: '',
    starRating: '',
    sealNameplate: '',
    sealMainTank: '',
    manufacturer: '',
    serialNumber: '',
    testDate: '',
    fee: '',
    receipt: '',
    reseptdate:'',
    powerstationdate: '',
    eltrdate: '',
    customer: '',
    village: '',
    sanctionLetter: '',
    eeLetter: '',
    layout: '',
  });

 
  const [errors, setErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [customInputs, setCustomInputs] = useState({});
  const [customSelected, setCustomSelected] = useState({});
  


 
  
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!data.place.trim()) newErrors.place = 'Subdivision is required';
    if (!data.capacity.trim()) newErrors.capacity = 'Capacity is required';
    if (!data.starRating.trim()) newErrors.starRating = 'Star rating is required';
    if (!data.sealNameplate.trim()) newErrors.sealNameplate = 'Seal Nameplate is required';
    if (!data.sealMainTank.trim()) newErrors.sealMainTank = 'Seal Main Tank is required';
    if (!data.manufacturer.trim()) newErrors.manufacturer = 'Manufacturer is required';
    if (!data.serialNumber.trim()) newErrors.serialNumber = 'Serial Number is required';
    if (!data.testDate) newErrors.testDate = 'Test date is required';
    if (!data.fee.trim() || isNaN(data.fee)) newErrors.fee = 'Valid fee is required';
    if (!data.receipt.trim()) newErrors.receipt = 'Receipt details are required';
    if (!data.customer.trim()) newErrors.customer = 'Customer name is required';
    if (!data.village.trim()) newErrors.village = 'Village is required';
    if (!data.sanctionLetter.trim()) newErrors.sanctionLetter = 'Sanction Letter info is required';
    if (!data.eeLetter.trim()) newErrors.eeLetter = 'EE Letter info is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generatePDF = async () => {
    setFormSubmitted(true);
    if (!validateForm()) return;
    const element = printRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(data.pageno+'.pdf');
  };
  const dropdownOptions = {
    place: ['SHIMOGA RSD', 'SHIMOGA CSD-1', 'SHIMOGA CSD-2', 'SHIMOGA CSD-3', 'THIRTHAHALLI','KUMSI','SHIKARIPURA',
      'ANAVATTI','SHIRALKOPPA','SAGARA','SORABA','HOSANAGARA'
    ],
    capacity: ['25 KVA', '63 KVA', '100 KVA', '250 KVA'],
    starRating: [ '3 Star', '4 Star', '5 Star'],
    
    manufacturer: ['Nagashree enterprises', 'R V Transformers','Chaitanya electric company' ,'Sreenevaasa concret products'],
    layout: ['LAYOUT',
'DWS',
'MSB',
'ADPS']
    
  };


  return (
    <div style={{ padding: '20px', fontFamily: 'Times New Roman' }}>
      <h2>MESCOM Transformer Test Report</h2>
      <form style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {Object.entries({
          pageno:'Page No',
                                serialNumber: 'Transformer Serial No',
          place: 'Subdivision',
                                sealNameplate: 'Seal No. Nameplate',
          sanctionLetter: 'Power Sanction No', 
                                sealMainTank: 'Seal No. Main Tank',
           powerstationdate: 'Power Sanction Date',
                                manufacturer: 'Manufacturers',                      
          eeLetter: 'Ee ltr No ', 
                                capacity: 'Capacity (e.g. 100 KVA)',
          eltrdate: 'Ee ltr Date', 
                                 testDate: 'Test Date',
          customer: 'Customer Name',
                              starRating: 'Star Rating (e.g. 5 Star)',
          village: 'Village',
                             fee: 'Testing Fee (e.g. 1180)',
          receipt: 'Receipt No  (e.g. 3361)',
                             reseptdate:'Receipt Date (e.g. 4.4.25)',
                             layout: 'layout',
          
                              
          
          
          
          
         }).map(([name, label]) => (
          <div key={name} style={{ display: 'flex', flexDirection: 'column' }}>
            {dropdownOptions[name] ? (
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <select
      name={name}
      value={customSelected[name] ? 'custom' : data[name]}
      onChange={(e) => {
        const value = e.target.value;
        if (value === 'custom') {
          setCustomSelected({ ...customSelected, [name]: true });
          setData({ ...data, [name]: '' });
        } else {
          setCustomSelected({ ...customSelected, [name]: false });
          setData({ ...data, [name]: value });
        }
      }}
      style={{
        padding: '8px',
        border: errors[name] ? '1px solid red' : '1px solid #ccc',
        marginBottom: '5px'
      }}
    >
      <option value="">Select {label}</option>
      {dropdownOptions[name].map((option) => (
        <option key={option} value={option}>{option}</option>
      ))}
      <option value="custom">Other (Type manually)</option>
    </select>
    {customSelected[name] && (
      <input
        type="text"
        placeholder={`Enter custom ${label}`}
        value={customInputs[name] || ''}
        onChange={(e) => {
          const value = e.target.value;
          setCustomInputs({ ...customInputs, [name]: value });
          setData({ ...data, [name]: value });
        }}
        name={name}
        style={{
          padding: '8px',
          border: errors[name] ? '1px solid red' : '1px solid #ccc',
        }}
      />
    )}
  </div>
) : (
  <input
    type={name.toLowerCase().includes('date') ? 'date' : 'text'}
    placeholder={`Enter ${label}`}
    name={name}
    value={data[name]}
    onChange={handleChange}
    style={{
      padding: '8px',
      border: errors[name] ? '1px solid red' : '1px solid #ccc',
    }}
  />
)}
{formSubmitted && errors[name] && (
  <span style={{ color: 'red', fontSize: '12px' }}>{errors[name]}</span>
)}
          </div>
        ))}
      </form>


      {formSubmitted && Object.keys(errors).length > 0 && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          Please fill in all required fields correctly before generating the PDF.
        </div>
      )}

      <button onClick={generatePDF} style={{ margin: '20px 0' }}>Download PDF</button>

      

      <div ref={printRef} style={{ padding: '20px', border: '1px solid #ccc', backgroundColor: '#fff', width: '800px', fontFamily: 'Times New Roman' }}>
        <h2 style={{textAlign:'right'}} >{data.pageno}</h2>
        <div style={{
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '10px',
}}>
  <img src={logo} alt="MESCOM Logo" style={{ height: '60px', marginRight: '10px' }} />
  <div style={{ textAlign: 'center' }}>
    <h2 style={{ margin: 0 }}>MANGALORE ELECTRICITY SUPPLY COMPANY LTD.</h2>
    <p style={{ fontStyle: 'italic', margin: 0 }}>(A Government of Karnataka Undertaking)</p>
  </div>
</div>

<hr style={{
  border: 'none',
  height: '4px',
  backgroundColor: 'black',
  margin: '10px 0 20px 0'
}} />

        <table border="1" cellPadding="5" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <td><p><strong>FROM: <br/>ASST EXECUTIVE ENGINEER [ELEC.],<br/> DTR SUBDIVISION, MESCOM,<br/> Shimoga-577201<br/>
        MOBILE: 9448289656 <br/>
Email:</strong>aeedtrsmg@gmail.com <br/>
aeedtrsmg@rediffmail.com 
        </p></td>
        <td><p><strong>TO:<br/> ASST EXECUTIVE ENGINEER [ELE.],<br/> O & M SUB DIVISION,<br/> MESCOM,<br/> {data.place}</strong>  </p></td>
        </table>
        <p><strong>No:</strong> AEE/AE-1/DTR/SMG/2025-26/ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>Date:</strong> </p>
        
        <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>Subject:</strong> Testing of 01 no of {data.capacity} {data.starRating} Transformer - reg.</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>Ref:</strong> 1) Power Sanction Letter No: {data.sanctionLetter} Dated:{data.powerstationdate}<br/>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2) EE Letter No: {data.eeLetter} Dated:{data.eltrdate}</p>
        <p>
          Adverting to the above subject, 01 no of {data.capacity} {data.starRating} Distribution Transformer was tested at Shimoga Repair Center by the Asst Engineer (Ele)-2, DTR, MESCOM, Shimoga on {data.testDate}. The Tested Transformer is to be installed to {data.layout
          } in favour of {data.customer}, {data.village} village under self execution. The tested results of Transformer are found satisfactorily.
        </p>
        <p><strong>Testing fee paid:</strong> Rs. {data.fee}/- vide Rt No: {data.receipt}</p>

        <table border="1" cellPadding="5" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Sl No</th><th>Capacity</th><th>Seal No. (Nameplate/Main Tank)</th><th>Make</th><th>Serial No</th><th>Tested on</th><th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>01</td>
              <td>{data.capacity} ({data.starRating})</td>
              <td>{data.sealNameplate}<br/>Name plate <br/> {data.sealMainTank}<br/>Main tank</td>
              <td>{data.manufacturer}</td>
              <td>{data.serialNumber}</td>
              <td>{data.testDate}</td>
              <td>Satisfactory</td>
            </tr>
          </tbody>
        </table>

        <p style={{ textAlign: 'right', marginTop: '40px', fontWeight: 'bold', lineHeight: '1.5', whiteSpace: 'pre-line' }}>
          Assistant Executive Engineer (Ele).,<br />
          DTR Sub Division, MESCOM,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br />
          Shimoga.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </p>
        <p style={{ textAlign: 'left', marginTop: '40px', fontWeight: 'bold', lineHeight: '1.5', whiteSpace: 'pre-line' }}>
            Copy to: <br/>
            1. AEE, TAQC, MESCOM, Shimoga for kind information<br/> 
            2. MF/OC
        </p>
      </div>
    </div>
  );
}
