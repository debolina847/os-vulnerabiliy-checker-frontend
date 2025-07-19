import React, { useState } from 'react';
import logo from './logo.svg'; // Replace with your logo path

const VulnerabilityScan = () => {
    const [ip, setIp] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    //Handle input change
    const handleInputChange = (event) => {
        setIp(event.target.value);
    };
    //Triger scan
    const handleScanClick = async () => {
        setLoading(true);
        await scanIP(ip);
        setLoading(false);
    };
    // Send scan request to Flask backend
    const scanIP = async (ip) => {
        try {
            const response = await fetch('http://127.0.0.1:5000/scan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ip }),
            });

            if (response.ok) {
                const data = await response.json();
                setResult(data); //Store result
            } else {
                alert('Error during scan. Please try again.');
            }
        } catch (error) {
            console.error('Request failed:', error);
            alert('Error during scan. Please try again.');
        }
    };
//Handle PDF download from backend
    const handleDownload = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/download', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ip }),
            });

            if (!response.ok) throw new Error('Failed to download PDF');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `scan_${ip}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Download error:', error);
            alert('Failed to download PDF');
        }
    };

    return (
        <div style={{ backgroundColor: '#001f3f', minHeight: '100vh', padding: '20px', fontFamily: 'Arial, sans-serif', textAlign: 'center' }}>
            <img src={logo} alt="Logo" style={{ width: '120px', marginBottom: '20px' }} />
            <h1 style={{ fontFamily: 'Times New Roman,Times,serif',color:'white'}}>
                OS Vulnerability Checker</h1>
            <input
                type="text"
                placeholder="Enter IP address"
                value={ip}
                onChange={handleInputChange}
                style={{ marginRight: '10px', padding: '8px' }}
            />
            <button onClick={handleScanClick} disabled={loading} style={{ padding: '8px 16px' }}>
                {loading ? 'Scanning...' : 'Scan'}
            </button>

            {result && (
                <div style={{ marginTop: '30px' }}>
                    <h2 style={{ color: 'white'}}>Scan Result:</h2>
                    <pre style={{ backgroundColor: '#C1E9FC',fontSize: '15px', padding: '10px' }}>{result.result}</pre>
                    <button onClick={handleDownload} style={{ marginTop: '12px', padding: '8px 16px' }}>
                        Download PDF
                    </button>
                </div>
            )}
        </div>
    );
};

export default VulnerabilityScan;
