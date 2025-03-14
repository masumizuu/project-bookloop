import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';

const BookLoop = () => {
    const navigate = useNavigate();

    return (
        <div className="relative h-[100vh] bg-cover bg-center bg-no-repeat"
             style={{ backgroundImage: "url('/pics/2.gif')"}}>

            {/* helmet */}
            <Helmet>
                <title>bookloop | home</title>
            </Helmet>

            {/* div at lower half of screen */}
            <div className="absolute bottom-0 h-1/2 w-full flex flex-row items-center justify-start bg-cover bg-center bg-no-repeat"
                 style={{ backgroundImage: "url('/cream-bg.png')"}}>

                {/* left div */}
                <div className="w-1/3 h-full">
                    <h1 className="text-2xl italic text-brown-0 pt-10 pl-4"><b className="text-6xl">“</b>Reading is a <br/>passport to countless <br/>adventures.”</h1>
                    <p className="text-xl ml-10 text-brown-0">— Mary Pope Osborne</p>
                </div>

                {/* right div */}
                <div className="ml-10 w-1/2 h-full">
                    <h1 className="text-6xl italic glow-brown text-brown-0 font-bold p-4 pt-12">bookloop</h1>
                    <p className="text-2xl text-brown-0 p-4 pb-10"> A community-driven platform where book lovers can donate, borrow, and exchange books for free. Whether you're looking to share your favorite reads, discover new stories, or find a book you’ve been searching for, <em> <b className="font-pd">bookloop</b></em> makes it easy and accessible. Join us in creating a sustainable reading culture—one book at a time! </p>

                    {/* button */}
                    <button className="btn-fancy group ml-4">
                        {/* on top */}
                        <span className="btn-fancy-line w-4 -top-0 h-1 left-6 transform -translate-y-1/2 group-hover:w-0 bg-cover bg-center bg-no-repeat"
                              style={{ backgroundImage: "url('/cream-bg.png')"}}></span>
                        {/* beside the text */}
                        <span className="btn-fancy-line w-6 top-1/2 left-6 transform -translate-y-1/2 group-hover:bg-cream-0 bg-brown-0"></span>
                        <a onClick={() => navigate('/home/search')} className="font-pd pl-8 uppercase text-lg transition-all duration-300 ease-in-out group-hover:glow-cream">
                            Browse
                        </a>
                        {/* two below */}
                        <span className="btn-fancy-line w-6 -bottom-0.5 right-12 group-hover:w-0 bg-cover bg-center bg-no-repeat"
                              style={{ backgroundImage: "url('/cream-bg.png')"}}></span>
                        <span className="btn-fancy-line w-2.5 -bottom-0.5 right-2.5 group-hover:w-0 bg-cover bg-center bg-no-repeat"
                              style={{ backgroundImage: "url('/cream-bg.png')"}}></span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookLoop;