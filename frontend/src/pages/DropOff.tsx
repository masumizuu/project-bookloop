import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';

const DropOff = () => {
    const navigate = useNavigate();

    return (
        <div className="relative h-[100vh] bg-cover bg-center bg-no-repeat"
             style={{ backgroundImage: "url('/dropoff/bg.png')"}}>

            {/* helmet */}
            <Helmet>
                <title>bookloop | drop-off</title>
            </Helmet>

            {/* div at lower half of screen */}
            <div className="absolute bottom-0 h-1/2 w-full flex flex-row items-center justify-center bg-cover bg-center bg-no-repeat"
                 style={{ backgroundImage: "url('/cream-bg.png')"}}>

                {/* left div */}
                <div className="ml-10 w-1/2 h-full flex flex-col items-center justify-center">
                    <h1 className="text-4xl italic text-brown-0 font-bold p-4 pt-12">📌 Drop-Off</h1>
                    <p className="text-2xl text-brown-0 p-4 pb-10">All transactions have a default drop-off location
                        at <b className="font-pd uppercase">📌 Mapua Library, Mapua University - Makati campus.</b> If a different drop-off place is preferred, please discuss and proceed with the discretion of the owner and the borrower. Have a nice day! ✨</p>
                </div>

                {/* right div */}
                <div className="w-1/3 h-full py-20 pl-10">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.5718616259087!2d121.01243041146836!3d14.566458885857058!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c9080e6f2abd%3A0x1d5b9be15aad02!2sMap%C3%BAa%20University%20Makati!5e0!3m2!1sen!2sph!4v1741365052168!5m2!1sen!2sph"
                        width="400"
                        height="300"
                        style={{ border: 0, borderRadius: '12px' }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
            </div>
        </div>
    );
};

export default DropOff;