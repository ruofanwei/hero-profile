import { Alert, Button, Spin } from 'antd';
import { useParams } from 'react-router-dom';
import { css } from 'styled-components';
import HeroCard from './HeroCard';
import { useHeroData } from '../context/HeroDataContext';

const wrapperStyles = css`
  background: #fff;
  border-radius: 16px;
  padding: 32px 24px 28px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
`;

const stateStyles = css`
  padding: 80px 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const HeroList = () => {
  const { heroId } = useParams<{ heroId?: string }>();
  const { heroes, isLoading, isFetching, error, refetch } = useHeroData();

  if (isLoading) {
    return (
      <div css={wrapperStyles}>
        <div css={stateStyles}>
          <Spin size="large" />
        </div>
      </div>
    );
  }

  if (error && heroes.length === 0) {
    return (
      <div css={wrapperStyles}>
        <div css={stateStyles}>
          <Alert
            message="無法載入英雄列表"
            description={error}
            type="error"
            action={
              <Button type="primary" onClick={() => void refetch()}>
                重新整理
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div css={wrapperStyles}>
      {isFetching && (
        <div
          css={css`
            display: flex;
            justify-content: flex-end;
            margin-bottom: 16px;
          `}
        >
          <Spin size="small" />
        </div>
      )}
      {error && heroes.length > 0 && (
        <Alert
          css={css`
            margin-bottom: 16px;
          `}
          message="更新列表失敗"
          description="顯示的是最後成功載入的資料。"
          type="warning"
          showIcon
        />
      )}
      <div
        css={css`
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          justify-content: center;
        `}
      >
        {heroes.map((hero) => (
          <HeroCard key={hero.id} hero={hero} isSelected={hero.id === heroId} />
        ))}
      </div>
    </div>
  );
};

export default HeroList;
