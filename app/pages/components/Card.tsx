import type { ReactNode } from "react";
import styled from "styled-components";

type CardProps = {
  content: {
    title?: string;
    description: ReactNode;
    button?: ReactNode;
  };
  disabled?: boolean;
  fullWidth?: boolean;
};

const CardWrapper = styled.div<{
  fullWidth?: boolean | undefined;
  disabled?: boolean | undefined;
}>`
  display: flex;
  flex-direction: column;
  width: ${({ fullWidth }) => (fullWidth ? "100%" : "250px")};
  background-color: ;
  margin-top: 2.4rem;
  margin-bottom: 2.4rem;
  padding: 2.4rem;
  border: 1px solid;
  border-radius: ;
  box-shadow: ;
  filter: opacity(${({ disabled }) => (disabled ? ".4" : "1")});
  align-self: stretch;
`;

export const Card = ({ content, disabled = false, fullWidth }: CardProps) => {
  const { title, description, button } = content;
  return (
    <CardWrapper fullWidth={fullWidth} disabled={disabled}>
      {title && <div>{title}</div>}
      <div>{description}</div>
      {button}
    </CardWrapper>
  );
};
