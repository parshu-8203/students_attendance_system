import React, { useEffect, useState } from 'react';
import { generateQR } from '../../services/apiService';
import { setStudentRecords } from '../../services/apiService';
import './index.css';
import QRCode from 'react-qr-code';

const GenerateQRCode = () => {
    const [Qrcode, setQRcode] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const fetchQR = async () => {
        const data = await generateQR();
        setQRcode(data.qrCode);
    }
    const setRecords = async () => {
        try {
            const data = await setStudentRecords();
            console.log(data);
        } catch (err) {
            console.log(err);
        }
    }


    useEffect(() => {
        let intervalId;

        if (isGenerating) {
            fetchQR();
            intervalId = setInterval(fetchQR, 60000);
        }
        return () => {
            clearInterval(intervalId);
        };
    }, [isGenerating]);

    const toggleGeneration = () => {
        setQRcode('');

        if (!isGenerating) {
            const shouldGenerate = window.confirm("Are you sure you want to generate QR code?");
            if (shouldGenerate) {
                setRecords();
                setIsGenerating(prevState => !prevState);
            }
        } else {
            setIsGenerating(prevState => !prevState);
        }
    };
    return (
        <div className='qrcode-container'>
            <div className='empty-box'>
                {Qrcode && (
                    <div>
                        <QRCode value={Qrcode} size={250} />
                    </div>
                )}
            </div>
            <div>
                <button onClick={toggleGeneration}>
                    {isGenerating ? 'Stop Generating' : 'Start Generating'}
                </button>
            </div>
        </div>
    );
}

export default GenerateQRCode;
