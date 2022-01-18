import React, { ChangeEvent, KeyboardEvent, useEffect, useState } from 'react';
import { categoryAPI } from '../../../api/categoryApi';
import { useAppDispatch, useAppSelector } from '../../../config/hooks';
import { alert, showAlert } from '../../../reducers/componetSlice';
import StyleIcon from '@material-ui/icons/Style';
import { IconButton } from '@material-ui/core';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import { isNumber } from '../../../utils/regex';
import MovieIcon from '@material-ui/icons/Movie';
import SportsEsportsIcon from '@material-ui/icons/SportsEsports';
import SportsBaseballIcon from '@material-ui/icons/SportsBaseball';
import SportsBasketballIcon from '@material-ui/icons/SportsBasketball';
import SportsSoccerIcon from '@material-ui/icons/SportsSoccer';
import SportsTennisIcon from '@material-ui/icons/SportsTennis';
import GroupIcon from '@material-ui/icons/Group';

interface ICategory {
  id: number;
  name: string;
  user_num: number;
  createdAt?: string;
  updatedAt: string;
}

const List = () => {
  const dispatch = useAppDispatch();
  // 알림 창 존재 유무
  const isExistAlert = useAppSelector(alert) !== '';
  // 카테고리
  const [category, setCategory] = useState<ICategory[]>([]);
  // 선택된 카테고리
  const [selectedId, setSelectedId] = useState<number>(-1);
  const [selectId, setSelectId] = useState<number>(-1);
  // 선택된 카테고리 이름
  const [selectedName, setSelectedName] = useState<string>('');

  // input 값 수정
  const textChangeHandler = (
    e: ChangeEvent<HTMLInputElement>,
    id: number,
  ): void => {
    const index = category.findIndex((obj) => obj.id === id);
    const temp_category = [...category];
    if (e.target.id === 'name-' + id) {
      temp_category[index].name = e.target.value;
    } else if (e.target.id === 'user_num-' + id && isNumber(e.target.value)) {
      temp_category[index].user_num = Number(e.target.value);
    }
    setCategory(temp_category);
  };

  document.body.addEventListener('mouseover', () => {
    setSelectedId(-1);
  });

  // 카테고리 불러오기
  const getCategory = async () => {
    const {
      data: {
        data: { categoryList: data },
      },
    } = await categoryAPI.list();
    const temp_data = data.map((obj: ICategory) => {
      const { id, name, user_num, updatedAt } = obj;
      return {
        id,
        name,
        user_num,
        updatedAt,
      };
    });
    if (temp_data.length !== 0) {
      setCategory(temp_data);
    } else {
      setCategory([]);
    }
  };

  useEffect((): void => {
    getCategory();
  }, [selectId]);

  // 카테고리 수정
  const updateCategory = async () => {
    const index = category.findIndex((obj) => obj.id === selectId);
    const newName = category[index].name;
    const newUserNum = category[index].user_num;
    console.log(selectedName, newName, newUserNum);
    console.log(typeof selectedName, typeof newName, typeof newUserNum);
    await categoryAPI
      .update(selectedName, newName, newUserNum)
      .then((res) => {
        dispatch(showAlert('updateCategory'));
        setSelectId(-1);
        setSelectedName('');
        setTimeout(() => {
          getCategory();
        }, 10);
      })
      .catch((err) => {
        dispatch(showAlert('updateCategoryError'));
      });
  };

  // 카테고리 삭제
  const deleteCategory = async (name: string) => {
    await categoryAPI.delete(name).then((res) => {
      dispatch(showAlert('deleteCategory'));
      setTimeout(() => {
        getCategory();
      }, 10);
    });
  };

  // 엔터 단축키 관련
  const pressEnter = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.code === 'Enter' && !isExistAlert) {
      updateCategory();
    }
  };

  return (
    <>
      <div className="text-lg font-semibold pl-1">카테고리 목록</div>
      <div className=" w-160 text-sm text-sub mt-2">
        <div className="flex items-center w-full relative mb-1 font-semibold">
          <div className="w-2/5 pl-10">이름</div>
          <div className="w-1/4 pl-1">인원 수</div>
          <div className="w-1/3">최종 수정 날짜</div>
        </div>
        {category.map((obj) => {
          const { name, user_num, updatedAt, id } = obj;
          return (
            <div
              className="rounded-full transition-all hover:bg-lightMain"
              key={id}
              onMouseOver={(e) => {
                e.stopPropagation();
                setSelectedId(id);
              }}
            >
              <div className="flex items-center w-full relative py-1 border-b-1">
                <div className="w-2/5 pl-8 py-1 pr-1">
                  <input
                    type="text"
                    id={'name-' + id}
                    className={`py-1 pl-1 w-full border-2 ${
                      selectId === id
                        ? 'rounded-md outline-main border-sub'
                        : 'border-transparent bg-transparent'
                    }`}
                    value={name}
                    onChange={(e) => {
                      textChangeHandler(e, id);
                    }}
                    onKeyPress={pressEnter}
                    disabled={selectId === id ? false : true}
                  />
                </div>
                <div className="w-1/4 py-1 pr-2">
                  <input
                    type="text"
                    id={'user_num-' + id}
                    className={`py-1 pl-1 w-full border-2 ${
                      selectId === id
                        ? 'rounded-md outline-main border-sub'
                        : 'border-transparent bg-transparent'
                    }`}
                    value={user_num}
                    onChange={(e) => {
                      textChangeHandler(e, id);
                    }}
                    onKeyPress={pressEnter}
                    disabled={selectId === id ? false : true}
                  />
                </div>
                <div className="w-1/3">{updatedAt}</div>
                <div className="absolute left-1 ">
                  {name === '축구' ? (
                    <SportsSoccerIcon />
                  ) : name === '농구' ? (
                    <SportsBasketballIcon />
                  ) : name === '테니스' ? (
                    <SportsTennisIcon />
                  ) : name === '배드민턴' ? (
                    <SportsTennisIcon />
                  ) : name === '야구' ? (
                    <SportsBaseballIcon />
                  ) : name === '영화' ? (
                    <MovieIcon />
                  ) : name === '게임' ? (
                    <SportsEsportsIcon />
                  ) : name === '미팅' ? (
                    <GroupIcon />
                  ) : (
                    <StyleIcon />
                  )}
                </div>
                {selectId === id ? (
                  <div
                    className={`absolute right-10 transition-all ${
                      selectedId === id ? 'opacity-100' : 'opacity-0'
                    }`}
                    onClick={updateCategory}
                  >
                    <div className="relative group">
                      <IconButton size="small">
                        <SaveIcon className="text-sub" />
                      </IconButton>
                      <div className="absolute -bottom-5 left-0.25 text-xs bg-sub text-white px-0.5 py-0.5 rounded-sm transition-all opacity-0 group-hover:opacity-100">
                        저장
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`absolute right-10 transition-all ${
                      selectedId === id ? 'opacity-100' : 'opacity-0'
                    }`}
                    onClick={() => {
                      setSelectId(id);
                      setSelectedName(name);
                    }}
                  >
                    <div className="relative group">
                      <IconButton size="small">
                        <EditIcon className="text-sub" />
                      </IconButton>
                      <div className="absolute -bottom-5 left-0.25 text-xs bg-sub text-white px-0.5 py-0.5 rounded-sm transition-all opacity-0 group-hover:opacity-100">
                        수정
                      </div>
                    </div>
                  </div>
                )}
                {selectId === id ? (
                  <div
                    className={`absolute right-1 transition-all ${
                      selectedId === id ? 'opacity-100' : 'opacity-0'
                    }`}
                    onClick={() => {
                      setSelectId(-1);
                      setSelectedName('');
                    }}
                  >
                    <div className="relative group">
                      <IconButton size="small">
                        <CancelIcon className="text-sub" />
                      </IconButton>
                      <div className="absolute -bottom-5 left-0.25 text-xs bg-sub text-white px-0.5 py-0.5 rounded-sm transition-all opacity-0 group-hover:opacity-100">
                        취소
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`absolute right-1 transition-all ${
                      selectedId === id ? 'opacity-100' : 'opacity-0'
                    }`}
                    onClick={() => {
                      deleteCategory(name);
                    }}
                  >
                    <div className="relative group">
                      <IconButton size="small">
                        <DeleteForeverIcon className="text-sub" />
                      </IconButton>
                      <div className="absolute -bottom-5 left-0.25 text-xs bg-sub text-white px-0.5 py-0.5 rounded-sm transition-all opacity-0 group-hover:opacity-100">
                        삭제
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default List;
