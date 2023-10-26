import { animated, useSpring } from "@react-spring/web";
import { ReactNode } from "react";

interface IFadeInProps {
  delay?: number;
  children: ReactNode;
}

const FadeIn = ({ delay, children }: IFadeInProps) => {
  const styles = useSpring({
    from: {
      opacity: 0,
    },
    to: {
      opacity: 1,
    },
    delay,
  });

  return <animated.div style={styles}>{children}</animated.div>;
};

export default FadeIn;
