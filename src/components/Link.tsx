import { DetailedHTMLProps, AnchorHTMLAttributes } from "react";
import Item from "src/components/Item";
import app from "src/stores/app";

type ILink = DetailedHTMLProps<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>;

const Link = (props: ILink) => {
  const { colors } = app;

  return (
    <>
      <Item textColor={colors.mutedText} onClick={() => {}}>
        <a {...props} />
      </Item>

      <style jsx>{`
        a {
          color: inherit;
          text-decoration: inherit;
        }
      `}</style>
    </>
  );
};

export default Link;
