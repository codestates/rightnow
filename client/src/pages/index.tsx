import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../config/hooks';
import Logo from '../components/Logo';
import phone from '../images/phones.png';
import highFive from '../images/High_five.gif';
import thinking from '../images/thinking-pana.png';
import chat from '../images/Chat-pana.png';
import select from '../images/Select-pana.png';
import waiting from '../images/Work time-pana.png';
import Slider from '../components/Slider';
import { userIsLogin } from '../reducers/userSlice';
import { useTitle } from '../Routes';

interface IList {
  id: string;
  label: string;
}

const RendingPage = () => {
  useTitle('Right now');
  const isLogin = useAppSelector(userIsLogin);
  const scrollRef = useRef(new Array(5));
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

    // if (window.scrollY + window.innerHeight > 850) {
    //   document.getElementById('left-slide-2')?.classList.add('left-slide-2');
    //   document.getElementById('right-slide-1')?.classList.add('right-slide-1');
    // }

    // if (window.scrollY + window.innerHeight > 1550) {
    //   document.getElementById('bounce-5')?.classList.add('bounce-1');
    //   document.getElementById('bounce-6')?.classList.add('bounce-1');
    // }

    // if (window.scrollY + window.innerHeight > 2230) {
    //   document.getElementById('bounce-7')?.classList.add('bounce-1');
    //   document.getElementById('bounce-8')?.classList.add('bounce-1');
    // }

    // if (window.scrollY + window.innerHeight > 2570) {
    //   document.getElementById('slider')?.classList.add('slide');
    // }

    // if (window.scrollY + window.innerHeight > 2960) {
    //   document.getElementById('bounce-9')?.classList.add('bounce-1');
    //   document.getElementById('bounce-10')?.classList.add('bounce-1');
    // }

    // if (window.scrollY + window.innerHeight > 3200) {
    //   document.getElementById('team')?.classList.add('bounce-1');
    //   document.getElementById('bounce-12')?.classList.add('bounce-2');
    //   document.getElementById('bounce-13')?.classList.add('bounce-3');
    //   document.getElementById('bounce-14')?.classList.add('bounce-4');
    //   document.getElementById('bounce-15')?.classList.add('bounce-5');
    //   document.getElementById('bounce-16')?.classList.add('bounce-6');
    // }

    // 스크롤이 바닥까지 내려갔는지 확인
    if (Math.ceil(window.scrollY) + window.innerHeight >= document.body.offsetHeight - 20) {
      setIsScrollFloor(true);
    } else {
      setIsScrollFloor(false);
    }
  };

  // useEffect(() => {
  //   handleScroll();
  // }, []);

  useEffect(() => {
    const inViewport = (entries: any, observer: any) => {
      for (let entry of entries) {
        if (entry.target.classList.contains('section1')) {
          document.getElementById('sub-title')?.classList.toggle('left-slide-2', entry.isIntersecting);
          document.getElementById('ex-btn')?.classList.toggle('left-slide-2', entry.isIntersecting);
        } else if (entry.target.classList.contains('section2')) {
          document.getElementById('left-slide-2')?.classList.toggle('left-slide-2', entry.isIntersecting);
          document.getElementById('right-slide-1')?.classList.toggle('left-slide-2', entry.isIntersecting);
        } else if (entry.target.classList.contains('section3')) {
          document.getElementById('bounce-5')?.classList.toggle('bounce-1', entry.isIntersecting);
          document.getElementById('bounce-6')?.classList.toggle('bounce-1', entry.isIntersecting);
        } else if (entry.target.classList.contains('section4')) {
          document.getElementById('slider')?.classList.toggle('slide', entry.isIntersecting);
          document.getElementById('bounce-7')?.classList.toggle('bounce-1', entry.isIntersecting);
          document.getElementById('bounce-8')?.classList.toggle('bounce-1', entry.isIntersecting);
        } else if (entry.target.classList.contains('section5')) {
          document.getElementById('bounce-9')?.classList.toggle('bounce-1', entry.isIntersecting);
          document.getElementById('bounce-10')?.classList.toggle('bounce-1', entry.isIntersecting);

          document.getElementById('team')?.classList.toggle('bounce-1', entry.isIntersecting);
          document.getElementById('bounce-12')?.classList.toggle('bounce-2', entry.isIntersecting);
          document.getElementById('bounce-13')?.classList.toggle('bounce-3', entry.isIntersecting);
          document.getElementById('bounce-14')?.classList.toggle('bounce-4', entry.isIntersecting);
          document.getElementById('bounce-15')?.classList.toggle('bounce-5', entry.isIntersecting);
          document.getElementById('bounce-16')?.classList.toggle('bounce-6', entry.isIntersecting);
        }
      }
    };
    const options = {
      threshold: 0.6,
    };
    const observer = new IntersectionObserver(inViewport, options);

    const section = document.querySelectorAll('.section');

    section.forEach((el) => {
      observer.observe(el);
    });
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    return () => {
      window.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', handleScroll);
    };
  }, []);

  // const firstContentY: number = 604;
  // const contentDy: number = 670;

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

  const scrollTo = (idx: number) => {
    console.log('스크롤');
    const target = scrollRef.current;
    return target[idx].scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="overflow-y-scroll scroll-smooth snap-y snap-mandatory h-full w-full">
      <header className={`text-sub w-screen fixed flex justify-center transition duration-1000 ease-in-out z-10 py-5 `}>
        <div className=" flex items-center justify-between w-10/12">
          <div
            className={`font-bold cursor-pointer flex items-center text-logo`}
            ref={(el) => (scrollRef.current[0] = el)}
            onClick={(e) => scrollTo(0)}
          >
            <Logo width={scrollPosition === 0 ? 85 : 70} />
            <span className="ml-2 text-main">RightNow</span>
          </div>
          <div className=" flex items-center space-x-1">
            {location.pathname === '/' &&
              pageList.map((obj, idx) => {
                const { id, label } = obj;
                return (
                  <div
                    key={id}
                    className={`py-3 px-4 mx-3 hover:text-white hover:font-semibold rounded-lg hover:bg-main cursor-pointer`}
                    onClick={(e) => scrollTo(idx + 1)}
                  >
                    {label}
                  </div>
                );
              })}
            <Link to={isLogin ? '/search' : '/auth/login'} className="flex items-center">
              <button className="rounded-lg text-gray-100 whitespace-nowrap bg-main group relative" style={{ width: 86, height: 43 }}>
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
      <div
        id="section1"
        className="section section1 h-screen flex justify-center items-center snap-center"
        ref={(el) => (scrollRef.current[0] = el)}
        onClick={(e) => scrollTo(0)}
      >
        <div className="h-full w-9/12 flex justify-between items-center">
          <div className=" font-sans font-bold space-y-10 text-gray-100" style={{ letterSpacing: -1.5 }}>
            <p className="text-sub text-4xl bounce-1" id="sub-title">
              동네 친구 만들기, Right Now!
            </p>
            <p className=" text-2xl bounce-2"></p>
            <p className=" bounce-3"></p>
            <div
              className=" flex bg-main w-72 h-16 rounded-2xl relative group cursor-pointer bounce-4"
              id="ex-btn"
              onClick={() => {
                if (isLogin) {
                  router('/search');
                } else {
                  router('/auth/login');
                }
              }}
            >
              <div className="rounded-2xl bg-gray-100 w-5 opacity-0 group-hover:w-full group-hover:opacity-100" style={{ transition: '0.3s' }} />
              <div className="flex items-center text-lg absolute top-4.5 left-8 transition-all tracking-normal text-gray-100 group-hover:text-main">
                임시 계정으로 체험하기
              </div>
              <div className="bg-gray-100 flex justify-center items-center w-16 h-16 rounded-2xl text-black absolute top-0 right-0">🔥</div>
            </div>
          </div>
          <img src={highFive} alt="phone" className="w-192" />
        </div>
      </div>
      <div
        id="section2"
        className="section section2 h-screen bg-gray-100 flex justify-center relative snap-center"
        ref={(el) => (scrollRef.current[1] = el)}
        onClick={(e) => scrollTo(1)}
      >
        {/* <div className=" absolute top-0 left-0 bg-sub h-6 w-full" /> */}
        <div className=" w-9/12 flex text-sub justify-center items-center">
          <div className="w-192 space-y-4 opacity-0 left-64" id={'right-slide-1'}>
            <img src={thinking} alt="thinking-img" />
          </div>
          <div className="text-3xl w-120 space-y-1 font-semibold opacity-0" id={'left-slide-2'} style={{ letterSpacing: -1.5 }}>
            <p className="text-main"></p>
            <p className="whitespace-pre-line leading-10">{`멀리 나가긴 좀 그런데...
            동네에 놀 사람 없나?`}</p>
            <p className="text-xl font-medium">취미를 같이 즐길 수 있는 동네 친구가 필요하세요?</p>
          </div>
        </div>
        {/* <div className=" absolute bottom-0 left-0 bg-sub h-6 w-full" /> */}
      </div>
      <div
        id="section3"
        className="section section3 h-screen bg-gray-100 flex justify-center items-center relative snap-center"
        ref={(el) => (scrollRef.current[2] = el)}
        onClick={(e) => scrollTo(2)}
      >
        {/* <div className=" absolute top-0 left-0 bg-sub h-6 w-full" /> */}
        <div className="flex flex-col justify-center items-center h-full w-9/12 text-sub space-y-10">
          <div className="text-center text-3xl font-semibold opacity-0" style={{ letterSpacing: -1.5 }} id={'bounce-5'}>
            <span className=" text-main"></span> RightNow로 쉽게 동네 친구를 만들어보세요
          </div>
          <div className="flex w-full justify-between" id={'bounce-6'}>
            <div className="flex-1 flex flex-col justify-center items-center">
              <img src={select} alt="selecting category" />
              <div className="text-xl">친구와 같이 하고 싶은 취미를 선택하고</div>
            </div>
            <div className="flex-1 flex flex-col justify-center items-center">
              <img src={waiting} alt="waiting" />
              <div className="text-xl">매칭을 기다리면</div>
            </div>
            <div className="flex-1 flex flex-col justify-center items-center">
              <img src={chat} alt="" />
              <div className="text-xl">끝!</div>
            </div>
            {/* 농구, 축구, 독서, 맛집, 게임 등 친구와 같이 하고 싶은 취미를 선택하고, (카테고리 선택하는 장면 움짤로 보여주기)
            <div>매칭을 기다리면,(매칭 기다리는 모습 움짤로 보여주기)</div>
            <div>끝!(채팅방 들어와서 인사하는 모습 움짤)</div> */}
          </div>
        </div>
      </div>
      <div
        id="section4"
        className="section section4 h-screen bg-gray-100 flex justify-center items-center relative snap-center"
        ref={(el) => (scrollRef.current[3] = el)}
        onClick={(e) => scrollTo(3)}
      >
        <div className="h-screen w-9/12 text-sub space-y-10 flex flex-col justify-center items-center">
          <div className="text-center text-3xl opacity-0" style={{ letterSpacing: -1.5 }} id={'bounce-7'}>
            <span className="">사용 방법</span>
          </div>
          <div>
            <div className=" indent-5 px-16 text-center opacity-0" id={'bounce-8'}>
              Display your mobile apps awesome features with icon lists and an image carousel of each page. Lorem ipsum dolor sit amet, consectetuer
              adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam,
              quis nostrud exerci tation.
            </div>
            <div className="relative flex w-full justify-center" id={'slider'}>
              <Slider images={images} />
            </div>
          </div>
        </div>
      </div>
      <div
        id="section5"
        className="section section5 h-screen bg-sub flex justify-center relative snap-center"
        ref={(el) => (scrollRef.current[4] = el)}
        onClick={(e) => scrollTo(4)}
      >
        <div className=" w-278 pt-30 space-y-10 text-gray-100">
          <div className="text-center text-3xl font-semibold opacity-0" style={{ letterSpacing: -1.5 }} id={'bounce-9'}>
            <span className=" text-main">Contact</span> Us
          </div>
          <div className=" indent-5 px-16 text-center opacity-0" id={'bounce-10'}>
            Display your mobile apps awesome features with icon lists and an image carousel of each page. Lorem ipsum dolor sit amet, consectetuer
            adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis
            nostrud exerci tation.
          </div>
          <div className="flex">
            <div id={'team'} className="opacity-0" />
            <div className="w-full pl-4 space-y-5">
              <div className=" text-4xl font-semibold text-main opacity-0" id={'bounce-12'}>
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
              className={`absolute -bottom-5 right-0  ${isScrollFloor ? 'opacity-100' : 'opacity-0'}`}
              style={{ transition: '1.5s' }}
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <div className=" flex bg-main w-60 h-16 rounded-2xl relative group cursor-pointer">
                <div className=" rounded-2xl bg-gray-100 w-5 opacity-0 group-hover:w-full group-hover:opacity-100" style={{ transition: '0.3s' }} />
                <div className=" flex items-center text-lg absolute top-4.5 left-8 transition-all tracking-normal font-semibold text-gray-100 group-hover:text-main">
                  Go Top to Get Started
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RendingPage;
