import { WiStars } from 'react-icons/wi';
import { useNavigate } from 'react-router';

function LoginLandingPage() {
  const navigate = useNavigate();
  return (
    <div>
      {' '}
      <div className="h-full bg-brand-coral-400 rounded-r-xl bg-gradient-to-l from-rose-500 to-[#fc6767] text-white p-6">
        <div className="flex flex-col justify-center h-full space-y-2 hover-white">
          <div className="h-14 absolute top-10 left-10 hover:bg-brand-coral-400">
            <img
              src="../../../logo.svg"
              className=""
              onClick={() => {
                console.log('clicked');
                navigate('/');
              }}
            />
          </div>

          <div className="text-6xl font-bold instrument-serif flex items-center gap-2">
            Beyond tours{' '}
            <span className="text-sm font-thin instrument-serif">
              --------------------------------------
            </span>
            <span className="text-5xl">
              <WiStars />
            </span>
          </div>

          <h2 className="text-3xl font-semibold flex items-center gap-2 flex-wrap">
            Discover local gems through
            <span id="container">
              <div id="flip">
                <div>
                  <div className="instrument-serif italic text-3xl">
                    Traveling
                  </div>
                </div>
                <div>
                  <div className="instrument-serif italic text-3xl">
                    Cuisine
                  </div>
                </div>
                <div>
                  <div className="instrument-serif italic text-3xl">Event</div>
                </div>
              </div>
            </span>
          </h2>
        </div>
      </div>
    </div>
  );
}

export default LoginLandingPage;
