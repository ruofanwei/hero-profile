import { useState } from 'react';
import { Typography } from 'antd';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import type { Hero } from '../api/heroes';

type HeroCardProps = {
  hero: Hero;
  isSelected: boolean;
};

const CardLink = styled(Link)<{ $active: boolean }>`
  width: 150px;
  border: 2px solid transparent;
  border-radius: 12px;
  background: ${({ $active }) => ($active ? '#fff6ef' : '#fafafa')};
  padding: 12px;
  text-align: center;
  transition:
    border-color 0.2s ease,
    transform 0.2s ease,
    background 0.2s ease;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-color: ${({ $active }) => ($active ? '#ff7a18' : 'transparent')};

  &:hover {
    transform: translateY(-2px);
    border-color: #ffdda8;
  }
`;

const ImageWrapper = styled.div`
  width: 100%;
  aspect-ratio: 3 / 4;
  border-radius: 8px;
  overflow: hidden;
  background: #eee;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const HeroImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const ImageError = styled.div`
  font-size: 12px;
  color: #8c8c8c;
  padding: 8px;
  text-align: center;
`;

const HeroName = styled(Typography.Text)`
  font-weight: 600;
  text-align: center;
`;

const HeroCard = ({ hero, isSelected }: HeroCardProps) => {
  const [imageError, setImageError] = useState(false);

  return (
    <CardLink
      to={`/heroes/${hero.id}`}
      $active={isSelected}
      aria-label={`View ${hero.name} profile`}
      data-selected={isSelected ? 'true' : 'false'}
    >
      <ImageWrapper>
        {imageError ? (
          <ImageError>Image unavailable</ImageError>
        ) : (
          <HeroImage
            src={hero.image}
            alt={hero.name}
            loading="lazy"
            decoding="async"
            onError={() => setImageError(true)}
          />
        )}
      </ImageWrapper>
      <HeroName>{hero.name}</HeroName>
    </CardLink>
  );
};

export default HeroCard;
