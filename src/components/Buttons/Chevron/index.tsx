import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { RectButtonProps } from 'react-native-gesture-handler';

import { Container, Chevron, Icon, IconContainer, Title } from './styles';

interface IProps extends RectButtonProps {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
}

export function ChevronButton({ title, icon, ...rest }: IProps) {
  return (
    <Container {...rest}>
      <IconContainer>
        <Icon name={icon} />
      </IconContainer>

      <Title>{title}</Title>

      <Chevron name="chevron-forward-outline" />
    </Container>
  );
}
