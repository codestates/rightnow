import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../config/hooks';
import Logo from '../components/Logo';
import phone from '../images/phones.png';
import 'react-alice-carousel/lib/alice-carousel.css';
import Slider from '../components/Slider';
import { userIsLogin } from '../reducers/userSlice';

interface IList {
  id: string;
  label: string;
}

const RendingPage = () => {
  const isLogin = useAppSelector(userIsLogin);
  // 스크린샷 더미데이터
  const images = [
    {
      url: 'https://media.vlpt.us/images/j20park/post/9091046f-6732-43fb-a8e3-e44c17e5820f/Web-Development.jpg',
      alt: 'default',
    },
    {
      url: 'https://media.vlpt.us/images/j20park/post/9091046f-6732-43fb-a8e3-e44c17e5820f/Web-Development.jpg',
      alt: 'default',
    },
    {
      url: 'https://media.vlpt.us/images/j20park/post/9091046f-6732-43fb-a8e3-e44c17e5820f/Web-Development.jpg',
      alt: 'default',
    },
    {
      url: 'https://media.vlpt.us/images/j20park/post/9091046f-6732-43fb-a8e3-e44c17e5820f/Web-Development.jpg',
      alt: 'default',
    },
  ];

  const location = useLocation();
  const router = useNavigate();
  // const [loadingOpacity, setLoadingOpacity] = useState<string>('opacity-100');
  // const [loadingZIndex, setLoadingZIndex] = useState<string>('z-30');

  // useEffect((): void => {
  //   setTimeout(() => {
  //     setLoadingOpacity('opacity-0');
  //   }, 1000);
  //   setTimeout(() => {
  //     setLoadingZIndex('-z-20');
  //   }, 1500);
  // }, []);

  // 스크롤 위치
  const [scrollPosition, setScrollPosition] = useState<number>(0);

  // 스크롤 위치가 바닥인지 판단
  const [isScrollFloor, setIsScrollFloor] = useState<boolean>(false);

  const handleScroll = (): void => {
    // 스크롤 위치
    const position = window.scrollY;
    setScrollPosition(position);

    if (window.scrollY + window.innerHeight > 850) {
      document.getElementById('left-slide-2')?.classList.add('left-slide-2');
      document.getElementById('right-slide-1')?.classList.add('right-slide-1');
    }

    if (window.scrollY + window.innerHeight > 1550) {
      document.getElementById('bounce-5')?.classList.add('bounce-1');
      document.getElementById('bounce-6')?.classList.add('bounce-1');
    }

    if (window.scrollY + window.innerHeight > 2230) {
      document.getElementById('bounce-7')?.classList.add('bounce-1');
      document.getElementById('bounce-8')?.classList.add('bounce-1');
    }

    if (window.scrollY + window.innerHeight > 2570) {
      document.getElementById('slider')?.classList.add('slide');
    }

    if (window.scrollY + window.innerHeight > 2960) {
      document.getElementById('bounce-9')?.classList.add('bounce-1');
      document.getElementById('bounce-10')?.classList.add('bounce-1');
    }

    if (window.scrollY + window.innerHeight > 3200) {
      document.getElementById('team')?.classList.add('bounce-1');
      document.getElementById('bounce-12')?.classList.add('bounce-2');
      document.getElementById('bounce-13')?.classList.add('bounce-3');
      document.getElementById('bounce-14')?.classList.add('bounce-4');
      document.getElementById('bounce-15')?.classList.add('bounce-5');
      document.getElementById('bounce-16')?.classList.add('bounce-6');
    }

    // 스크롤이 바닥까지 내려갔는지 확인
    if (
      Math.ceil(window.scrollY) + window.innerHeight >=
      document.body.offsetHeight - 20
    ) {
      setIsScrollFloor(true);
    } else {
      setIsScrollFloor(false);
    }
  };

  useEffect(() => {
    handleScroll();
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    return () => {
      window.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', handleScroll);
    };
  }, []);

  const firstContentY: number = 604;
  const contentDy: number = 670;

  const pageList: IList[] = [
    {
      id: 'about',
      label: 'About',
    },
    {
      id: 'howItWorks',
      label: 'How it works',
    },
    {
      id: 'screenShots',
      label: 'Screenshots',
    },
    {
      id: 'contact',
      label: 'Contact',
    },
  ];

  return (
    <>
      <header
        className={`w-screen fixed  flex justify-center transition-all z-10 ${
          location.pathname !== '/'
            ? 'bg-sub py-3'
            : scrollPosition
            ? ' bg-sub py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className=" flex items-center justify-between w-278">
          <div
            className={`text-gray-100 font-bold transition-all cursor-pointer flex items-center ${
              location.pathname !== '/'
                ? 'text-4xl'
                : scrollPosition
                ? 'text-4xl'
                : 'text-5xl'
            }`}
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <Logo width={scrollPosition === 0 ? 90 : 70} />
            <span className="ml-2">rightnow</span>
          </div>
          <div className=" flex items-center space-x-1">
            {location.pathname === '/' &&
              pageList.map((obj, idx) => {
                const { id, label } = obj;
                return (
                  <div
                    key={id}
                    className={`py-3 px-4 text-gray-100 rounded-lg hover:bg-main cursor-pointer ${
                      idx === pageList.length - 1
                        ? ((scrollPosition >=
                            firstContentY + contentDy * idx - 1 &&
                            scrollPosition <=
                              firstContentY + contentDy * (idx + 1) - 1) ||
                            isScrollFloor) &&
                          'bg-main'
                        : scrollPosition >=
                            firstContentY + contentDy * idx - 1 &&
                          scrollPosition <=
                            firstContentY + contentDy * (idx + 1) - 1 &&
                          !isScrollFloor &&
                          'bg-main'
                    }`}
                    style={{ transition: '0.3s' }}
                    onClick={() => {
                      window.scrollTo({
                        top: firstContentY + contentDy * idx,
                        behavior: 'smooth',
                      });
                    }}
                  >
                    {label}
                  </div>
                );
              })}
            <Link
              to={isLogin ? '/search' : '/auth/login'}
              className="flex items-center"
            >
              <button
                className="rounded-lg text-gray-100 whitespace-nowrap bg-main group relative"
                style={{ width: 86, height: 43 }}
              >
                <div
                  className="h-full rounded-lg bg-gray-100 w-4 opacity-0 group-hover:w-full group-hover:opacity-100"
                  style={{ transition: '0.3s' }}
                />
                <span className=" absolute top-3 left-4.5 font-semibold text-gray-100 transition-all group-hover:text-main">
                  {isLogin ? 'Chat in' : 'Sign in'}
                </span>
              </button>
            </Link>
          </div>
        </div>
      </header>
      {/* <div
        id="preloader"
        className={`${loadingOpacity} ${loadingZIndex}`}
        style={{ transition: '0.3s' }}
      >
        <div id="loading" />
      </div> */}
      <div className="pt-60 flex justify-center" id={'header'}>
        <div className=" w-278 flex justify-between">
          <div
            className=" font-sans font-bold space-y-10 text-gray-100"
            style={{ letterSpacing: -1.5 }}
          >
            <p className=" text-4xl bounce-1">FRIENDLY TEMPLATE FOR YOUR APP</p>
            <p className=" text-main text-2xl bounce-2">FOR YOUR SMARTPHONE</p>
            <p className=" bounce-3">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. We ensure
              sit amet,consectetur adipiscing elit
            </p>
            <div
              className=" flex bg-main w-60 h-16 rounded-2xl relative group cursor-pointer bounce-4"
              onClick={() => {
                if (isLogin) {
                  router('/search');
                } else {
                  router('/auth/login');
                }
              }}
            >
              <div
                className=" rounded-2xl bg-gray-100 w-5 opacity-0 group-hover:w-full group-hover:opacity-100"
                style={{ transition: '0.3s' }}
              />
              <div className=" flex items-center text-lg absolute top-4.5 left-8 transition-all tracking-normal text-gray-100 group-hover:text-main">
                Get Started
              </div>
              <div className="bg-gray-100 flex justify-center items-center w-16 h-16 rounded-2xl text-black absolute top-0 right-0">
                🔥
              </div>
            </div>
          </div>
          <img
            src={phone}
            alt="phone"
            className="block relative left-slide-1"
          />
        </div>
      </div>
      <div className="h-167.5 bg-gray-100 flex justify-center relative">
        <div className=" absolute top-0 left-0 bg-sub h-6 w-full" />
        <div className=" w-278 py-30 flex text-sub">
          <div
            className="text-4xl w-1/4 space-y-1 font-semibold opacity-0 -left-40"
            id={'left-slide-2'}
            style={{ letterSpacing: -1.5 }}
          >
            <p className="text-main">HEY THERE!</p>
            <p>WELCOME TO</p>
            <p>OUR SITE</p>
          </div>
          <div
            className="w-3/4 space-y-4 opacity-0 left-64"
            id={'right-slide-1'}
          >
            <p className=" text-3xl">
              Start Bootstrap has everything you need to get your
            </p>
            <p>
              Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit
              aut fugit, sed quia consequuntur magni dolores eos qui ratione
              voluptatem sequi nesciunt.Contrary to popular belief, Lorem Ipsum
              is not simply random text. It has roots in a piece of classical
              Latin literature from 45 BC, making it over 2000 years old.
              Richard McClintock, a Latin professor at Hampden-Sydney College in
              Virginia, looked up one of the more obscure Latin words,
              consectetur, from a Lorem Ipsum passage, and going through the
              cites of the word in classical literature, discovered the
              undoubtable source. Lorem Ipsum comes from sections 1.10.32 and
              1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good
              and Evil) by Cicero, written in 45 BC. This book is a treatise on
              the theory of ethics, very popular during the Renaissance. The
              first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes
              from a line in section 1.10.32.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit.
            </p>
            <p>
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
              officia deserunt mollit anim id est laborum. Sed ut perspiciatis
              unde omnis iste natus error sit
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit.
            </p>
          </div>
        </div>
        <div className=" absolute bottom-0 left-0 bg-sub h-6 w-full" />
      </div>
      <div className="h-167.5 bg-gray-100 flex justify-center relative">
        <div className=" absolute top-0 left-0 bg-sub h-6 w-full" />
        <div className=" w-278 pt-30 text-sub space-y-10">
          <div
            className="text-center text-3xl font-semibold opacity-0"
            style={{ letterSpacing: -1.5 }}
            id={'bounce-5'}
          >
            <span className=" text-main">How it</span> works
          </div>
          <div
            className=" indent-5 px-16 text-center opacity-0"
            id={'bounce-6'}
          >
            Display your mobile apps awesome features with icon lists and an
            image carousel of each page. Lorem ipsum dolor sit amet,
            consectetuer adipiscing elit, sed diam nonummy nibh euismod
            tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi
            enim ad minim veniam, quis nostrud exerci tation.
          </div>
        </div>
        <div className=" absolute bottom-0 left-0 bg-sub h-6 w-full" />
      </div>
      <div className="h-167.5 bg-gray-100 flex justify-center relative">
        <div className=" absolute top-0 left-0 bg-sub h-6 w-full" />
        <div className=" w-278 pt-30 text-sub space-y-10">
          <div
            className="text-center text-3xl font-semibold opacity-0"
            style={{ letterSpacing: -1.5 }}
            id={'bounce-7'}
          >
            <span className=" text-main">Screen</span> Shots
          </div>
          <div
            className=" indent-5 px-16 text-center opacity-0"
            id={'bounce-8'}
          >
            Display your mobile apps awesome features with icon lists and an
            image carousel of each page. Lorem ipsum dolor sit amet,
            consectetuer adipiscing elit, sed diam nonummy nibh euismod
            tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi
            enim ad minim veniam, quis nostrud exerci tation.
          </div>
          <div className="relative opacity-0 -left-40" id={'slider'}>
            <Slider images={images} />
          </div>
        </div>
        <div className=" absolute bottom-0 left-0 bg-sub h-6 w-full" />
      </div>
      <div className=" h-222 bg-sub flex justify-center relative">
        <div className=" w-278 pt-30 space-y-10 text-gray-100">
          <div
            className="text-center text-3xl font-semibold opacity-0"
            style={{ letterSpacing: -1.5 }}
            id={'bounce-9'}
          >
            <span className=" text-main">Contact</span> Us
          </div>
          <div
            className=" indent-5 px-16 text-center opacity-0"
            id={'bounce-10'}
          >
            Display your mobile apps awesome features with icon lists and an
            image carousel of each page. Lorem ipsum dolor sit amet,
            consectetuer adipiscing elit, sed diam nonummy nibh euismod
            tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi
            enim ad minim veniam, quis nostrud exerci tation.
          </div>
          <div className="flex">
            <div id={'team'} className="opacity-0" />
            <div className="w-full pl-4 space-y-5">
              <div
                className=" text-4xl font-semibold text-main opacity-0"
                id={'bounce-12'}
              >
                Code Bakery
              </div>
              <div className=" space-y-10">
                <div id={'bounce-13'} className="opacity-0">
                  Name : 정수비 <br />
                  Tel : 010-7794-4584 <br />
                  E-mail : jangsj95@naver.com
                </div>
                <div id={'bounce-14'} className="opacity-0">
                  Name : 김도연 <br />
                  Tel : 010-7794-4584 <br />
                  E-mail : jangsj95@naver.com
                </div>
                <div id={'bounce-15'} className="opacity-0">
                  Name : 박남수 <br />
                  Tel : 010-7794-4584 <br />
                  E-mail : jangsj95@naver.com
                </div>
                <div id={'bounce-16'} className="opacity-0">
                  Name : 장세진 <br />
                  Tel : 010-7794-4584 <br />
                  E-mail : jangsj95@naver.com
                </div>
              </div>
            </div>
          </div>
          <div className=" border-t-1 border-gray-100" />
          <div className=" text-gray-100 text-center mt-2 relative">
            ©2022 RightNow
            <div
              className={`absolute -bottom-5 right-0  ${
                isScrollFloor ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ transition: '1.5s' }}
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <div className=" flex bg-main w-60 h-16 rounded-2xl relative group cursor-pointer">
                <div
                  className=" rounded-2xl bg-gray-100 w-5 opacity-0 group-hover:w-full group-hover:opacity-100"
                  style={{ transition: '0.3s' }}
                />
                <div className=" flex items-center text-lg absolute top-4.5 left-8 transition-all tracking-normal font-semibold text-gray-100 group-hover:text-main">
                  Go Top to Get Started
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RendingPage;
