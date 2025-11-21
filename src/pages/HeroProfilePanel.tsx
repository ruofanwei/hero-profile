import { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Card,
  Flex,
  Space,
  Spin,
  Tooltip,
  Typography,
  message,
} from 'antd';
import { useParams } from 'react-router-dom';
import { css } from 'styled-components';
import { match, P } from 'ts-pattern';
import type { Hero, HeroProfile } from '../api/heroes';
import { patchHeroProfile } from '../api/heroes';
import { useHeroProfile } from '../hooks/useHeroProfile';
import { useHeroData } from '../hooks/useHeroData';
import { toApiError } from '../api/client';

const STAT_KEYS: Array<keyof HeroProfile> = ['str', 'int', 'agi', 'luk'];

const calculateTotal = (stats: HeroProfile) =>
  stats.str + stats.int + stats.agi + stats.luk;

const cardBaseStyles = css`
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 20px 25px -5px rgba(15, 23, 42, 0.08);
`;

type GuardParams = {
  heroId?: string;
  hero?: Hero;
  isHeroListLoading: boolean;
  isProfileLoading: boolean;
  profileError: string | null;
};

const buildGuardView = ({
  heroId,
  hero,
  isHeroListLoading,
  isProfileLoading,
  profileError,
}: GuardParams) =>
  match({
    heroId,
    hero,
    heroListLoading: isHeroListLoading,
    profileLoading: isProfileLoading,
    profileError,
  })
    .with({ heroId: P.nullish }, () => null)
    .with({ hero: P.nullish, heroListLoading: true }, () => (
      <div
        css={css`
          ${cardBaseStyles};
          display: flex;
          justify-content: center;
        `}
      >
        <Spin />
      </div>
    ))
    .with({ hero: P.nullish }, () => (
      <div
        css={css`
          ${cardBaseStyles};
        `}
      >
        <Alert
          message="找不到對應的英雄"
          description="請從列表中再次選擇英雄。"
          type="error"
          showIcon
        />
      </div>
    ))
    .with({ profileLoading: true }, () => (
      <div
        css={css`
          ${cardBaseStyles};
          display: flex;
          justify-content: center;
        `}
      >
        <Spin />
      </div>
    ))
    .with({ profileError: P.string }, ({ profileError }) => (
      <div
        css={css`
          ${cardBaseStyles};
        `}
      >
        <Alert
          message="無法載入能力值"
          description={`${profileError}，請稍後再試。`}
          type="error"
          showIcon
        />
      </div>
    ))
    .otherwise(() => undefined);

const HeroProfilePanel = () => {
  const { heroId } = useParams<{ heroId: string }>();
  const {
    heroes,
    refetch: refetchHeroes,
    isLoading: isHeroListLoading,
  } = useHeroData();
  const hero = heroes.find((item) => item.id === heroId);
  const {
    profile,
    setProfile,
    isLoading: isProfileLoading,
    error: profileError,
  } = useHeroProfile(heroId);
  const [draft, setDraft] = useState<HeroProfile | null>(null);
  const [baseTotal, setBaseTotal] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setDraft(profile);
      setBaseTotal(calculateTotal(profile));
      setSaveError(null);
    } else {
      setDraft(null);
    }
  }, [profile]);

  const remainingPoints =
    draft === null ? 0 : baseTotal - calculateTotal(draft);

  const handleAdjustStat = (key: keyof HeroProfile, delta: number) => {
    if (!draft) return;
    const nextValue = draft[key] + delta;
    if (nextValue < 0) return;
    const nextDraft = { ...draft, [key]: nextValue };
    if (calculateTotal(nextDraft) > baseTotal) return;
    setDraft(nextDraft);
  };

  const guardView = buildGuardView({
    heroId,
    hero,
    isHeroListLoading,
    isProfileLoading,
    profileError,
  });

  if (guardView !== undefined) {
    return guardView;
  }

  if (!draft) {
    return null;
  }

  return (
    <Card css={cardBaseStyles}>
      <Flex vertical gap={16}>
        <Flex align="stretch" gap={32} wrap="wrap">
          <div
            css={css`
              flex: 1;
              min-width: 240px;
              display: flex;
              flex-direction: column;
              gap: 8px;
            `}
          >
            {STAT_KEYS.map((key) => (
              <Flex
                key={key}
                align="center"
                gap={24}
                css={css`
                  padding: 12px 0;
                `}
              >
                <Typography.Text
                  css={css`
                    font-weight: 600;
                    width: 60px;
                    display: inline-block;
                  `}
                >
                  {key.toUpperCase()}
                </Typography.Text>
                <Space>
                  <Button
                    aria-label={`Increase ${key}`}
                    onClick={() => handleAdjustStat(key, 1)}
                    disabled={remainingPoints <= 0}
                  >
                    +
                  </Button>
                  <Typography.Text
                    css={css`
                      display: inline-block;
                      width: 30px;
                      text-align: center;
                      font-weight: 600;
                    `}
                  >
                    {draft[key]}
                  </Typography.Text>
                  <Button
                    aria-label={`Decrease ${key}`}
                    onClick={() => handleAdjustStat(key, -1)}
                    disabled={draft[key] <= 0}
                  >
                    -
                  </Button>
                </Space>
              </Flex>
            ))}
          </div>
          <div
            css={css`
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              justify-content: flex-end;
              gap: 12px;
              margin-left: auto;
            `}
          >
            <Typography.Text strong>剩餘點數：{remainingPoints}</Typography.Text>
            <Tooltip
              title={remainingPoints !== 0 ? '剩餘點數需為 0 才能儲存' : ''}
              placement="topRight"
              open={remainingPoints !== 0 ? undefined : false}
            >
              <span>
                <Button
                  type="primary"
                  onClick={async () => {
                    if (!heroId || !draft || remainingPoints !== 0) return;
                    setIsSaving(true);
                    setSaveError(null);
                    try {
                      await patchHeroProfile(heroId, draft);
                      setProfile(draft);
                      await refetchHeroes();
                      message.success('儲存成功');
                    } catch (err) {
                      const apiError = toApiError(err);
                      setSaveError(apiError.message);
                      message.error('儲存失敗，請稍後再試');
                    } finally {
                      setIsSaving(false);
                    }
                  }}
                  disabled={remainingPoints !== 0}
                  loading={isSaving}
                >
                  儲存
                </Button>
              </span>
            </Tooltip>
          </div>
        </Flex>
        {saveError && (
          <Alert
            message="儲存失敗"
            description={saveError}
            type="error"
            showIcon
          />
        )}
      </Flex>
    </Card>
  );
};

export default HeroProfilePanel;
