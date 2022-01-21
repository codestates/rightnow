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
// import Slider from '../components/SliderTemp';
import { userIsLogin } from '../reducers/userSlice';
import { useTitle } from '../Routes';
import styled from 'styled-components';
import dy from '../images/profile/dy.png';
import ns from '../images/profile/ns.png';
import sb from '../images/profile/sb.png';
import sj from '../images/profile/sj.png';

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
          document.querySelector('#to-top')?.classList.toggle('hidden', entry.isIntersecting);
        } else if (entry.target.classList.contains('section2')) {
          document.getElementById('left-slide-2')?.classList.toggle('left-slide-2', entry.isIntersecting);
          document.getElementById('right-slide-1')?.classList.toggle('left-slide-2', entry.isIntersecting);
        } else if (entry.target.classList.contains('section3')) {
          document.getElementById('bounce-5')?.classList.toggle('bounce-1', entry.isIntersecting);
          document.getElementById('bounce-6')?.classList.toggle('bounce-1', entry.isIntersecting);
        } else if (entry.target.classList.contains('section4')) {
          document.getElementById('slider')?.classList.toggle('slide', entry.isIntersecting);
          // document.getElementById('bounce-7')?.classList.toggle('bounce-1', entry.isIntersecting);
          // document.getElementById('bounce-8')?.classList.toggle('bounce-1', entry.isIntersecting);
        } else if (entry.target.classList.contains('section5')) {
          document.querySelector('#rending-header')?.classList.toggle('text-gray-100', entry.isIntersecting);

          document.getElementById('team')?.classList.toggle('bounce-1', entry.isIntersecting);
          document.getElementById('bounce-12')?.classList.toggle('bounce-2', entry.isIntersecting);
          document.getElementById('bounce-13')?.classList.toggle('bounce-3', entry.isIntersecting);
          document.getElementById('bounce-14')?.classList.toggle('bounce-4', entry.isIntersecting);
          document.getElementById('bounce-15')?.classList.toggle('bounce-5', entry.isIntersecting);
          document.getElementById('bounce-16')?.classList.toggle('bounce-6', entry.isIntersecting);
        } else if (entry.target.classList.contains('section4-1')) {
          document.getElementById('section4-1')?.classList.toggle('slide', entry.isIntersecting);
        } else if (entry.target.classList.contains('section4-2')) {
          document.getElementById('section4-2')?.classList.toggle('slide', entry.isIntersecting);
        }
      }
    };
    const options = {
      threshold: 0.9,
    };
    const observer = new IntersectionObserver(inViewport, options);

    const section = document.querySelectorAll('.section');

    section.forEach((el) => {
      observer.observe(el);
    });
  }, []);

  // useEffect(() => {
  //   window.addEventListener('scroll', handleScroll, { passive: true });
  //   window.addEventListener('resize', handleScroll, { passive: true });
  //   return () => {
  //     window.addEventListener('scroll', handleScroll);
  //     window.addEventListener('resize', handleScroll);
  //   };
  // }, []);

  // const firstContentY: number = 604;
  // const contentDy: number = 670;

  const pageList: IList[] = [
    { id: 'main', label: 'Main' },
    {
      id: 'About',
      label: 'About',
    },
    {
      id: 'introduce',
      label: 'Introduce',
    },
    {
      id: 'features',
      label: 'Features',
    },
    {
      id: 'contact',
      label: 'Contact',
    },
  ];

  const scrollTo = (idx: number) => {
    const target = scrollRef.current;
    return target[idx].scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div id="rending-container" className="overflow-y-scroll scroll-smooth snap-y snap-mandatory h-full w-full">
      <div className={`text-sub w-full fixed flex justify-center transition duration-1000 ease-in-out z-10 py-5 `}>
        <Header id="rending-header" className=" flex items-center justify-between w-10/12">
          <div
            className={`font-bold cursor-pointer flex items-center text-logo`}
            ref={(el) => (scrollRef.current[0] = el)}
            onClick={(e) => scrollTo(0)}
          >
            <Logo width={scrollPosition === 0 ? 85 : 70} />
            <LogoText className="ml-2 text-main">RightNow</LogoText>
          </div>
          <div className=" flex items-center space-x-1">
            {location.pathname === '/' &&
              pageList.map((obj, idx) => {
                const { id, label } = obj;
                return (
                  <div
                    key={id}
                    className={`py-3 px-4 mx-3 hover:text-white hover:font-semibold rounded-lg hover:bg-main cursor-pointer`}
                    onClick={(e) => scrollTo(idx)}
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
        </Header>
      </div>
      {/* <div
        id="preloader"
        className={`${loadingOpacity} ${loadingZIndex}`}
        style={{ transition: '0.3s' }}
      >
        <div id="loading" />
      </div> */}
      <div
        id="section1"
        className="section section1 h-screen w-full flex justify-center items-center snap-center"
        ref={(el) => (scrollRef.current[0] = el)}
        onClick={(e) => scrollTo(0)}
      >
        <Section1Container className="h-full w-9/12 flex justify-between items-center">
          <Section1Content className="font-sans font-bold space-y-10 text-gray-100" style={{ letterSpacing: -1.5 }}>
            <Title className="text-sub text-4xl bounce-1 tracking-normal" id="sub-title">
              {`동네 친구 만들기,
               Right Now!`}
            </Title>
            <TempBtn
              className="flex items-center justify-start bg-main w-72 h-20 rounded-2xl hover:scale-105 transition-all cursor-pointer bounce-4"
              id="ex-btn"
              onClick={() => {
                if (isLogin) {
                  router('/search');
                } else {
                  router('/auth/login');
                }
              }}
            >
              <TempText className="flex items-center ml-7 text-xl transition-all tracking-normal text-gray-100">임시 계정으로 체험</TempText>
              <div className="bg-gray-100 flex justify-center items-center w-1/4 h-full rounded-2xl text-black absolute top-0 right-0">🔥</div>
            </TempBtn>
          </Section1Content>
          <img src={highFive} alt="phone" className="w-192" />
        </Section1Container>
      </div>
      <div
        id="section2"
        className="section section2 h-screen flex justify-center relative snap-center"
        ref={(el) => (scrollRef.current[1] = el)}
        onClick={(e) => scrollTo(1)}
      >
        {/* <div className=" absolute top-0 left-0 bg-sub h-6 w-full" /> */}
        <Section1Content className=" w-9/12 flex text-sub justify-center items-center">
          <div className="w-192 space-y-4 opacity-0 left-64" id={'right-slide-1'}>
            <img src={thinking} alt="thinking-img" />
          </div>
          <div className="text-3xl w-120 space-y-1 font-semibold opacity-0" id={'left-slide-2'} style={{ letterSpacing: -1.5 }}>
            <p className="text-main"></p>
            <p className="whitespace-pre-line leading-10 tracking-tight">{`멀리 나가긴 좀 그런데...
            동네에 놀 사람 없나?`}</p>
            <TextWhiteSpace className="text-xl font-medium tracking-tight">{`지금 당장 취미를 같이 즐길 수 있는 
            동네 친구가 필요하세요?`}</TextWhiteSpace>
          </div>
        </Section1Content>
        {/* <div className=" absolute bottom-0 left-0 bg-sub h-6 w-full" /> */}
      </div>
      <div
        id="section3"
        className="section section3 h-screen flex justify-center items-center relative snap-center"
        ref={(el) => (scrollRef.current[2] = el)}
        onClick={(e) => scrollTo(2)}
      >
        {/* <div className=" absolute top-0 left-0 bg-sub h-6 w-full" /> */}
        <div className="flex flex-col justify-center items-center h-full w-9/12 text-sub space-y-10">
          <div className="text-center text-3xl font-semibold opacity-0" style={{ letterSpacing: -1.5 }} id={'bounce-5'}>
            <span className="">RightNow로 쉽게 동네 친구를 만들어보세요</span>
          </div>
          <div className="flex w-full justify-between" id={'bounce-6'}>
            <div className="flex-1 flex flex-col justify-center items-center">
              <img src={select} alt="selecting category" />
              <Ex1 className="text-xl">{`취미를 선택하고`}</Ex1>
            </div>
            <div className="flex-1 flex flex-col justify-center items-center">
              <img src={waiting} alt="waiting" />
              <div className="text-xl">매칭을 기다리면</div>
            </div>
            <div className="flex-1 flex flex-col justify-center items-center">
              <img src={chat} alt="" />
              <div className="text-xl">끝!</div>
            </div>
          </div>
        </div>
      </div>
      <div
        id="section4"
        className="section section4 h-screen flex justify-center items-center relative snap-center"
        ref={(el) => (scrollRef.current[3] = el)}
        onClick={(e) => scrollTo(3)}
      >
        <div className="h-screen w-9/12 text-sub flex flex-col justify-center items-center">
          {/* <div className="text-center text-3xl font-semibold opacity-0 w-full mb-8" id={'bounce-7'}></div> */}
          <div className="relative flex w-full h-full items-center justify-between" id={'slider'}>
            {/* <Slider images={images} /> */}
            <div className="bg-red-300 w-2/3"></div>
            <div className="flex-1 whitespace-pre-line leading-6 indent-5 flex flex-col justify-center tracking-normal">
              <span className="text-3xl font-semibold mb-2">내 주변 사람들과 취미 모임</span>
              <div className="text-xl">같은 취미를 가진 사람과 매칭시켜줘요</div>
              <div className="text-lg text-gray-500 font-semibold">위치 기반 모임 매칭</div>
            </div>
          </div>
        </div>
      </div>
      <div className="section section4-1 h-screen flex justify-center items-center relative snap-center">
        <div className="h-screen w-9/12 text-sub space-y-10 flex flex-col justify-center items-center">
          <div className="w-full">
            <div className=" indent-5 px-16 text-center"></div>
            <div className="relative flex w-full justify-between" id={'section4-1'}>
              {/* <Slider images={images} /> */}
              <div className="w-5/12 bg-red-300 w-2/3">친구와 함께 모임 참가하기 움짤</div>
              <div className="w-7/12 whitespace-pre-line leading-6 indent-5 flex flex-col justify-center tracking-normal">
                <span className="text-3xl font-semibold mb-2">친구 관리</span>
                <div className="text-xl">새롭게 만난 사람들과 친구를 맺고 같이 모임에 참가할 수 있어요</div>
                <div className="text-lg text-gray-500 font-semibold">친구와 함께 모임 매칭</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="section section4-2 h-screen flex justify-center items-center relative snap-center">
        <div className="h-screen w-9/12 text-sub space-y-10 flex flex-col justify-center items-center">
          <div className="w-full">
            <div className=" indent-5 px-16 text-center"></div>
            <div className="relative flex w-full justify-between" id={'section4-2'}>
              {/* <Slider images={images} /> */}
              <div className="w-5/12 bg-red-300 w-3/2">
                <img src="https://user-images.githubusercontent.com/53068706/150506735-31bfaea1-2bcf-4191-8fe9-09a3cd719e78.gif" alt="" />
              </div>
              <div className="w-7/12 whitespace-pre-line leading-6 indent-5 flex flex-col justify-center tracking-normal">
                <span className="text-3xl font-semibold mb-2">간편한 소통</span>
                <div className="text-xl">매칭된 사람들끼리 실시간으로 소통할 수 있어요</div>
                <div className="text-lg text-gray-500 font-semibold">실시간 채팅</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        id="section5"
        className="section section5 h-screen bg-sub flex justify-center items-center relative snap-center"
        ref={(el) => (scrollRef.current[4] = el)}
        onClick={(e) => scrollTo(4)}
      >
        <div className=" w-10/12 space-y-10 text-gray-100">
          <div className="text-center text-3xl font-semibold opacity-0" style={{ letterSpacing: -1.5 }} id={'bounce-9'}>
            {/* <span className=" text-main">Contact</span> Us */}
            <div className="text-4xl font-semibold text-main opacity-0" id={'bounce-12'}>
              Code Baker
            </div>
          </div>
          {/* <div className=" indent-5 px-16 text-center opacity-0" id={'bounce-10'}>
            Display your mobile apps awesome features with icon lists and an image carousel of each page. Lorem ipsum dolor sit amet, consectetuer
            adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis
            nostrud exerci tation.
          </div> */}
          <div className="flex justify-center">
            {/* <div id={'team'} className="opacity-0" /> */}
            <div className="w-11/12 pl-4 space-y-5">
              <div className="flex justify-between text-lg">
                <Profile id={'bounce-13'} className="opacity-0">
                  <ProfileImg src={sb} alt="subi" />
                  <Name>정수비</Name>
                  <GitHubLink to="https://github.com/JeongSubi">
                    <i className="fab fa-github"></i> JeongSubi
                  </GitHubLink>
                </Profile>
                <Profile id={'bounce-14'} className="opacity-0">
                  <ProfileImg src={dy} alt="doyeon" />
                  <Name>김도연</Name>
                  <GitHubLink to="/">
                    <i className="fab fa-github"></i> kimdoyeonn
                  </GitHubLink>
                  <br />
                </Profile>
                <Profile id={'bounce-15'} className="opacity-0">
                  <ProfileImg src={ns} alt="namsu" />
                  <Name>박남수</Name>
                  <GitHubLink to="https://github.com/PARKNAMSU">
                    <i className="fab fa-github"></i> PARKNAMSU
                  </GitHubLink>
                </Profile>
                <Profile id={'bounce-16'} className="opacity-0">
                  <ProfileImg src={sj} alt="sejin" />
                  <Name>장세진</Name>
                  <GitHubLink to="https://github.com/JangSeBaRi">
                    <i className="fab fa-github"></i> JangSeBaRi
                  </GitHubLink>
                </Profile>
              </div>
            </div>
          </div>
          <div className=" border-t-1 border-gray-100" />
          <div className=" text-gray-100 text-center mt-2 relative">©2022 RightNow</div>
        </div>
      </div>
      <div className={`fixed w-16 h-16 z-10 bottom-8 right-8 transition-all opacity-100`} id="to-top" onClick={() => scrollTo(0)}>
        <div className=" flex bg-main w-full h-full rounded-2xl cursor-pointer justify-center items-center">
          {/* <div className=" rounded-2xl bg-gray-100 w-5" style={{ transition: '0.3s' }} /> */}
          <div className=" flex items-center text-lg transition-all tracking-normal font-semibold text-gray-100 group-hover:text-main">
            <i className="fas fa-arrow-up" style={{ fontSize: '2em' }}></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RendingPage;

const Title = styled.p`
  @media screen and (max-width: 1600px) {
    white-space: pre-line;
  }
  @media screen and (max-width: 1200px) {
    font-size: 2rem;
  }
  @media screen and (max-width: 1000px) {
    white-space: normal;
    margin-top: -1rem;
  }
`;

const LogoText = styled.span`
  @media screen and (max-width: 1200px) {
    display: none;
  }
`;

const TextWhiteSpace = styled.p`
  @media screen and (max-width: 1600px) {
    white-space: pre-line;
  }
  @media screen and (max-width: 1000px) {
    white-space: normal;
  }
`;

const Ex1 = styled.div`
  @media screen and (max-width: 1500px) {
    white-space: pre-line;
  }
`;

const TempBtn = styled.div`
  @media screen and (max-width: 1200px) {
    width: 15rem;
    height: 4rem;
  }
`;

const TempText = styled.div`
  @media screen and (max-width: 1200px) {
    font-size: 1.1rem;
    margin-left: 1.5rem;
  }
`;

const Section1Container = styled.div`
  @media screen and (max-width: 1000px) {
    align-items: center;
    justify-content: center;
    flex-direction: column-reverse;
  }
`;

const Section1Content = styled.div`
  @media screen and (max-width: 1000px) {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

const Header = styled.div`
  @media screen and (max-width: 1000px) {
    width: 90%;
  }
`;

const ProfileImg = styled.img`
  width: 70%;
`;

const Name = styled.div``;

const GitHubLink = styled(Link)``;

const Profile = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
