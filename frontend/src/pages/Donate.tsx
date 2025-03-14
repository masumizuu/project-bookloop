import { Helmet } from 'react-helmet-async';

const Donate = () => {

    return (
        <div className="relative h-[100vh] bg-cover bg-center bg-no-repeat"
             style={{ backgroundImage: "url('/donate/bg.png')"}}>

            {/* helmet */}
            <Helmet>
                <title>bookloop | donate</title>
            </Helmet>

            <div className="flex flex-row bg-cream-0 bg-opacity-50 h-full">
                {/* left div */}
                <div className="h-full w-2/3 flex flex-col justify-center pl-32 text-brown-0">

                    <img src="/donate/donate.png" alt="donate" className="w-72 mb-8"/>

                    <h1 className="relative text-3xl italic  mb-5">Help spread the joy of reading</h1>
                    <p className="text-2xl  mb-5">At <b>bookloop</b>, we believe that books should be shared, loved, and enjoyed by everyone.
                        Donating your books helps others discover new stories while promoting a sustainable and accessible reading culture. Whether it's a forgotten shelf gem or a cherished favorite, your donation can make a meaningful impact.</p>

                    <h1 className="text-3xl italic  mb-5">How it works</h1>
                    <p className="text-2xl">Online Donation Form: <a className="cursor-pointer hover:glow-brown underline italic">https://bit.ly/42HZwWj</a><br/>
                        Inquiries:<br/>
                        Patricia - <a className="cursor-pointer hover:glow-brown underline italic">pmdelacruz@mymail.mapua.edu.ph</a><br/>
                        Ira - <a className="cursor-pointer hover:glow-brown underline italic">ilbbayogos@mymail.mapua.edu.ph</a><br/>
                        Allyson - <a className="cursor-pointer hover:glow-brown underline italic">avivar@mymail.mapua.edu.ph</a><br/>
                        Champagne - <a className="cursor-pointer hover:glow-brown underline italic">cstgonzales@mymail.mapua.edu.ph</a></p>

                </div>

                {/* right div */}
                <div className="h-full w-1/3 flex flex-col justify-center px-12">
                    <img src="/donate/pic.png" alt="donate" className="w-full"/>
                </div>
            </div>
        </div>
    );
};

export default Donate;