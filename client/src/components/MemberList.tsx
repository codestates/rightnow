import React from 'react';
import styled from 'styled-components';
import defaultImg from '../images/profile.png';
import { UserType } from '../type';

const Container = styled.div`
  overflow-y: scroll;
  overflow-x: hidden;
  width: 100%;
  height: 95%;
  margin-top: 0.6rem;

  &::-webkit-scrollbar {
    width: 0.5rem;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-track {
    padding: 1rem;
  }
`;

const Member = styled.div`
  display: flex;
  align-items: center;
  padding: 0.3rem 0.5rem;
  border-radius: 4px;
  margin-bottom: 0.3rem;
  transition: background 0.2s ease-in;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
`;

const ImageContainer = styled.div``;

const ProfileImg = styled.div<{ url: string }>`
  width: 3rem;
  height: 3rem;
  background-size: auto 100%;
  background-position: center;
  background-image: url(${(props) => props.url});
  border-radius: 1.5rem;
  margin-right: 1rem;
`;

const ProfileName = styled.div`
  font-size: 1rem;
`;

const MemberList = ({ roomMember }: any) => {
  const memberList: Array<UserType> = roomMember;
  return (
    <Container>
      {memberList && memberList.length > 0 ? (
        memberList.map((member: UserType) => {
          return (
            <Member key={member.email}>
              <ImageContainer>
                <ProfileImg
                  url={
                    // image 정상 추가
                    member.profile_image
                      ? member.profile_image.indexOf('kakaocdn') === -1
                        ? process.env.REACT_APP_IMAGE_ENDPOINT + member.profile_image
                        : member.profile_image
                      : defaultImg
                  }
                />
              </ImageContainer>
              <ProfileName>{member.nick_name}</ProfileName>
            </Member>
          );
        })
      ) : (
        <div>대화 상대가 없습니다.</div>
      )}
    </Container>
  );
};

export default MemberList;
