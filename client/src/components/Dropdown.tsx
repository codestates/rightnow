import { SettingsRemote } from '@material-ui/icons';
import React, { MouseEventHandler, useCallback, useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: 20rem;
  &:hover {
    cursor: pointer;
  }
`;

const Main = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.7rem 1rem;
  border: 2px;
  background: white;
`;

const Options = styled.div<{ isActive: boolean }>`
  display: ${(props) => (props.isActive ? 'block' : 'none')};
  position: absolute;
  width: 20rem;
  background: white;
`;

const Option = styled.div<OptionProps>``;

const Item = styled.div``;

interface OptionProps {
  value: string;
  onClick: MouseEventHandler<HTMLDivElement>;
}

interface ItemType {
  id: number;
  name: string;
  user_num: number;
  createdAt: string;
  updatedAt: string;
}

interface DropdownProps {
  optionList: Array<ItemType>;
}

const Dropdown: React.FunctionComponent<DropdownProps> = ({ optionList }) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [option, setOption] = useState<String>('');
  const [selected, setSelected] = useState<ItemType>({
    id: -1,
    name: '',
    user_num: -1,
    createdAt: '',
    updatedAt: '',
  });

  const handleSelect = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const { id, innerText } = e.currentTarget;
    if (id !== 'default') {
      console.log(e.currentTarget.innerText);
      setIsActive((prev) => !prev);
      setOption(innerText);
    }
  }, []);

  const handleActive = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const { id } = e.target as HTMLDivElement;
    // console.log(e.target);
    setIsActive((prev) => !prev);
  }, []);

  return (
    <Container>
      <Main onClick={handleActive}>
        {option.length > 0 ? (
          <Item>{option}</Item>
        ) : (
          <Item id="default">선택해주세요.</Item>
        )}
      </Main>
      <Options isActive={isActive}>
        {optionList.length > 0 &&
          optionList.map((option) => {
            return (
              <Option
                key={option.id}
                value={option.name}
                onClick={handleSelect}
              >
                <Item id="item_name">{option.name}</Item>
              </Option>
            );
          })}
      </Options>
    </Container>
  );
};

export default Dropdown;
