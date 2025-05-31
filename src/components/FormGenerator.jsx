import React, { useRef, useState ,useEffect} from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import logo from '../assets/images.jpg';


export default function MescomReportForm() {
  const printRef = useRef();

  const [data, setData] = useState({
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
    customer: '',
    village: '',
    sanctionLetter: '',
    eeLetter: '',
  });

  const [docNumber, setDocNumber] = useState(0);

useEffect(() => {
  const lastNumber = localStorage.getItem('mescomDocNumber');
  const newNumber = lastNumber ? parseInt(lastNumber) + 1 : 1;
  localStorage.setItem('mescomDocNumber', newNumber);
  setDocNumber(newNumber);
}, []);



  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const generatePDF = async () => {
    const element = printRef.current;
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('mescom-report.pdf');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Times New Roman' }}>
        
      <h2>MESCOM Transformer Test Report</h2>
      <form style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <input name="place" placeholder="Place" onChange={handleChange}/>
        <input name="capacity" placeholder="Capacity (e.g. 100 KVA)" onChange={handleChange} />
        <input name="starRating" placeholder="Star Rating (e.g. 5 Star)" onChange={handleChange} />
        <input name="sealNameplate" placeholder="Seal No. Nameplate" onChange={handleChange} />
        <input name="sealMainTank" placeholder="Seal No. Main Tank" onChange={handleChange} />
        <input name="manufacturer" placeholder="Manufacturer" onChange={handleChange} />
        <input name="serialNumber" placeholder="Transformer Serial No" onChange={handleChange} />
        <input type="date" name="testDate" onChange={handleChange} />
        <input name="fee" placeholder="Testing Fee (e.g. 1180)" onChange={handleChange} />
        <input name="receipt" placeholder="Receipt No & Date (e.g. 3361/4.4.25)" onChange={handleChange} />
        <input name="customer" placeholder="Customer Name" onChange={handleChange} />
        <input name="village" placeholder="Village" onChange={handleChange} />
        <input name="sanctionLetter" placeholder="Sanction Letter No & Date" onChange={handleChange} />
        <input name="eeLetter" placeholder="EE Letter No & Date" onChange={handleChange} />
      </form>

      <button onClick={generatePDF} style={{ margin: '20px 0' }}>Download PDF</button>

      <div ref={printRef} style={{ padding: '20px', border: '1px solid #ccc', backgroundColor: '#fff', width: '800px', fontFamily: 'Times New Roman' }}>
        <h2 style={{textAlign:'right'}} >{docNumber}</h2>
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
        <td><p><strong>TO:<br/> ASST EXECUTIVE ENGINEER [ELE.),<br/> O & M SUB DIVISION,<br/> MESCOM,<br/> {data.place}</strong>  </p></td>
        </table>
        <p><strong>No:</strong> AEE/AE-1/DTR/SMG/2025-26/ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>Date:</strong> </p>
        
        <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>Subject:</strong> Testing of 01 no of {data.capacity} {data.starRating} Transformer - reg.</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>Ref:</strong> 1) Power Sanction Letter No: {data.sanctionLetter}<br/>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2) EE Letter No: {data.eeLetter}</p>
        <p>
          Adverting to the above subject, 01 no of {data.capacity} {data.starRating} Distribution Transformer was tested at Shimoga Repair Center by the Asst Engineer (Ele)-2, DTR, MESCOM, Shimoga on {data.testDate}. The Tested Transformer is to be installed to LAYOUT in favour of {data.customer}, {data.village} village under self execution. The tested results of Transformer are found satisfactorily.
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
