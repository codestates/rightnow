import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../config/hooks';
import {
  roomLat,
  roomLocation,
  roomLon,
  roomParticipant,
  setParticipant,
} from '../reducers/roomSlice';
import { userEmail } from '../reducers/userSlice';

// const { kakao } = window;

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const MapContainer = styled.div`
  width: 99%;
  height: 99%;
`;

declare global {
  interface Window {
    kakao: any;
  }
}

interface MapProps {
  type?: string;
}

const Map = ({ type }: MapProps) => {
  const dispatch = useAppDispatch();
  let participants = useAppSelector(roomParticipant);
  const email = useAppSelector(userEmail);
  const lon = useAppSelector(roomLon);
  const lat = useAppSelector(roomLat);

  useEffect(() => {
    if (type === 'search') {
      dispatch(setParticipant([{ user_email: email, lon, lat }]));
    }
  }, []);

  useEffect(() => {
    const makeMark = (map: any) => {
      participants.map((member: any) => {
        const { user_email, lat, lon } = member;

        const markerPosition = new window.kakao.maps.LatLng(lat, lon);
        const imageSrc =
            email === user_email
              ? 'data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHZpZXdCb3g9IjAgMCAxNzIgMTcyIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9Im5vbnplcm8iIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBzdHJva2UtbGluZWNhcD0iYnV0dCIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2UtZGFzaGFycmF5PSIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBmb250LWZhbWlseT0ibm9uZSIgZm9udC13ZWlnaHQ9Im5vbmUiIGZvbnQtc2l6ZT0ibm9uZSIgdGV4dC1hbmNob3I9Im5vbmUiIHN0eWxlPSJtaXgtYmxlbmQtbW9kZTogbm9ybWFsIj48cGF0aCBkPSJNMCwxNzJ2LTE3MmgxNzJ2MTcyeiIgZmlsbD0ibm9uZSI+PC9wYXRoPjxnPjxwYXRoIGQ9Ik05Ni43NSwxNTAuNWwtMTcuOTE2NjcsLTMyLjI1di0yMS41aDM1LjgzMzMzdjIxLjV6IiBmaWxsPSIjZmM4ZjAwIj48L3BhdGg+PHBhdGggZD0iTTcxLjY2NjY3LDc1LjI1YzAsMy45NTk1OCAtMy4yMDcwOCw3LjE2NjY3IC03LjE2NjY3LDcuMTY2NjdjLTMuOTU5NTgsMCAtNy4xNjY2NywtMy4yMDcwOCAtNy4xNjY2NywtNy4xNjY2N2MwLC0zLjk1OTU4IDMuMjA3MDgsLTcuMTY2NjcgNy4xNjY2NywtNy4xNjY2N2MzLjk1OTU4LDAgNy4xNjY2NywzLjIwNzA4IDcuMTY2NjcsNy4xNjY2N00xMzYuMTY2NjcsNzUuMjVjMCwzLjk1OTU4IC0zLjIwNzA4LDcuMTY2NjcgLTcuMTY2NjcsNy4xNjY2N2MtMy45NTk1OCwwIC03LjE2NjY3LC0zLjIwNzA4IC03LjE2NjY3LC03LjE2NjY3YzAsLTMuOTU5NTggMy4yMDcwOCwtNy4xNjY2NyA3LjE2NjY3LC03LjE2NjY3YzMuOTU5NTgsMCA3LjE2NjY3LDMuMjA3MDggNy4xNjY2Nyw3LjE2NjY3IiBmaWxsPSIjZmM4ZjAwIj48L3BhdGg+PHBhdGggZD0iTTEyOSw1My43NWMwLC0yNy4zNTg3NSAtNjQuNSwtMTcuODEyNzUgLTY0LjUsMHYyNS4wODMzM2MwLDE3LjgxMjc1IDE0LjQzNzI1LDMyLjI1IDMyLjI1LDMyLjI1YzE3LjgxMjc1LDAgMzIuMjUsLTE0LjQzNzI1IDMyLjI1LC0zMi4yNXoiIGZpbGw9IiNmZmFhNDUiPjwvcGF0aD48cGF0aCBkPSJNMTA3LjUsNzUuMjVjMCwxLjk3OCAxLjYwNTMzLDMuNTgzMzMgMy41ODMzMywzLjU4MzMzYzEuOTc4LDAgMy41ODMzMywtMS42MDUzMyAzLjU4MzMzLC0zLjU4MzMzYzAsLTEuOTc4IC0xLjYwNTMzLC0zLjU4MzMzIC0zLjU4MzMzLC0zLjU4MzMzYy0xLjk3OCwwIC0zLjU4MzMzLDEuNjA1MzMgLTMuNTgzMzMsMy41ODMzM003OC44MzMzMyw3NS4yNWMwLDEuOTc4IDEuNjA1MzMsMy41ODMzMyAzLjU4MzMzLDMuNTgzMzNjMS45NzgsMCAzLjU4MzMzLC0xLjYwNTMzIDMuNTgzMzMsLTMuNTgzMzNjMCwtMS45NzggLTEuNjA1MzMsLTMuNTgzMzMgLTMuNTgzMzMsLTMuNTgzMzNjLTEuOTc4LDAgLTMuNTgzMzMsMS42MDUzMyAtMy41ODMzMywzLjU4MzMzIiBmaWxsPSIjNzg0NzE5Ij48L3BhdGg+PHBhdGggZD0iTTk2Ljc1LDIxLjVjLTIxLjc2ODc1LDAgLTM1LjgzMzMzLDE3LjY0NzkyIC0zNS44MzMzMywzOS40MTY2N3Y4LjE4NDMzbDcuMTY2NjcsNi4xNDl2LTE3LjkxNjY3bDQzLC0xNC4zMzMzM2wxNC4zMzMzMywxNC4zMzMzM3YxNy45MTY2N2w3LjE2NjY3LC02LjIzODU4di04LjA5NDc1YzAsLTE0LjQyMjkyIC0zLjcxOTUsLTI4LjcyMDQyIC0yMS41LC0zMi4yNWwtMy41ODMzMywtNy4xNjY2N3oiIGZpbGw9IiM3OTU1NDgiPjwvcGF0aD48cGF0aCBkPSJNNTAuMTY2NjcsMTY0LjgzMzMzaDEwMy45MTY2N2MwLC0zOS4zMjcwOCAtMzkuNDE2NjcsLTQ2LjU4MzMzIC0zOS40MTY2NywtNDYuNTgzMzNsLTE3LjkxNjY3LDMyLjI1bC0xNy45MTY2NywtMzIuMjVjMCwwIC0xNC4zMzMzMywtMy41ODMzMyAtMjguNjY2NjcsLTQuMDA2MTd6IiBmaWxsPSIjZTc0YzNjIj48L3BhdGg+PHBhdGggZD0iTTQ2LjU4MzMzLDM5LjQxNjY3di0xNC4zMzMzM2MwLC03LjkxNTU4IC02LjQxNzc1LC0xNC4zMzMzMyAtMTQuMzMzMzMsLTE0LjMzMzMzYy03LjkxNTU4LDAgLTE0LjMzMzMzLDYuNDE3NzUgLTE0LjMzMzMzLDE0LjMzMzMzdjE0LjMzMzMzeiIgZmlsbD0iI2ZmYWE0NSI+PC9wYXRoPjxwYXRoIGQ9Ik00Ni41ODMzMyw4NnYtNTAuMTY2NjdoLTI4LjY2NjY3djYwLjkxNjY3bDM1LjgzMzMzLDU3LjMzMzMzbDIxLjUsLTM1LjgzMzMzeiIgZmlsbD0iI2U3NGMzYyI+PC9wYXRoPjwvZz48L2c+PC9zdmc+'
              : 'https://img.icons8.com/color/344/man-raising-hand-skin-type-3.png', // 마커이미지의 주소입니다
          imageSize = new window.kakao.maps.Size(64, 69), // 마커이미지의 크기입니다
          imageOption = { offset: new window.kakao.maps.Point(0, 0) }; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

        const markerImage = new window.kakao.maps.MarkerImage(
          imageSrc,
          imageSize,
          imageOption,
        );
        const marker = new window.kakao.maps.Marker({
          title: user_email,
          position: markerPosition,
          image: markerImage,
        });
        marker.setMap(map);
      });
    };
    const getMap = async () => {
      const success = (pos: any) => {
        const { latitude, longitude } = pos.coords;
        const container = document.getElementById('map-container');
        const options = {
          center: new window.kakao.maps.LatLng(latitude, longitude),
          level: 4,
        };
        const map = new window.kakao.maps.Map(container, options);
        makeMark(map);
      };
      const error = (err: any) => {
        console.log(err);
      };
      await navigator.geolocation.getCurrentPosition(success, error);
    };
    getMap();
  }, []);

  return (
    <Container>
      <MapContainer id="map-container"></MapContainer>
    </Container>
  );
};

export default Map;
