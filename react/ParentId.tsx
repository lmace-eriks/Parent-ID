import React from 'react';
import { useState, useEffect, useRef, CSSProperties } from 'react';

// Styles
import styles from "./styles.css";

interface ParentIdProps {
  promos: Array<PromoObject>
}

interface PromoObject {
  text: TextObject,
  image: ImageObject
  bannerLink: string,
  backgroundColor: string,
  parentList: Array<string>
}

interface TextObject {
  bannerMessage: string,
  bannerMessageFontSize: string,
  bannerSubMessage: string,
  bannerSubMessageFontSize: string,
  textColor: string
}

interface ImageObject {
  src: string,
  imageLeftOrRight: string
}

const ParentId: StorefrontFunctionComponent<ParentIdProps> = ({ promos }) => {
  const [showBanner, setShowbanner] = useState<Boolean>(false);
  const [bannerMessage, setBannerMessage] = useState<string>("");
  const [bannerMessageFontSize, setBannerMessageFontSize] = useState<string>("1.5rem");
  const [bannerSubMessage, setBannerSubMessage] = useState<string>("");
  const [bannerSubMessageFontSize, setBannerSubMessageFontSize] = useState<string>("1rem");
  const [bannerLink, setBannerLink] = useState<string>("");
  const [bannerImage, setBannerImage] = useState<string>("");
  const [imageDisplay, setImageDisplay] = useState<string>("none");
  const [imageLeftOrRIght, setImageLeftOrRight] = useState<string>("left");
  const [messageWrapperWidth, setMessageWrapperWidth] = useState<string>("50%");
  const [bannerTextColor, setBannerTextColor] = useState<string>("");
  const [bannerBackgroundColor, setBannerBackgroundColor] = useState<string>("");

  useEffect(() => {
    console.clear();
    // @ts-expect-error
    const currentUserURL: string = window.location.href.split(".com/")[1];

    let breakParentLoop: boolean = false;

    for (let i = 0; i < promos.length; i++) {
      const parentList = promos[i].parentList;
      if (breakParentLoop) break;

      for (let j = 0; j < parentList.length; j++) {
        const parent = new RegExp(parentList[j], "i");
        const parentFound = parent.test(currentUserURL);
        if (parentFound) {
          setBanner(i);
          breakParentLoop = true;
          break;
        } else {
          setShowbanner(false);
        }
      }
    }
  })

  const setBanner = (index: number) => {
    // @ts-expect-error
    const windowWidth: number = window.innerWidth;

    setBannerMessage(promos[index].text.bannerMessage);
    setBannerMessageFontSize(promos[index].text.bannerMessageFontSize);
    setBannerSubMessage(promos[index].text.bannerSubMessage);
    setBannerSubMessageFontSize(promos[index].text.bannerSubMessageFontSize);
    setBannerLink(promos[index].bannerLink || "#");
    setBannerTextColor(promos[index].text.textColor);
    setBannerBackgroundColor(promos[index].backgroundColor);

    if (promos[index].image) {
      setBannerImage(promos[index].image.src);
      setImageDisplay("block");
      setMessageWrapperWidth("50%");
      if (windowWidth >= 1026) {
        if (promos[index].image.imageLeftOrRight) {
          setImageLeftOrRight(promos[index].image.imageLeftOrRight);
        } else {
          setImageLeftOrRight("left");
        }
      } else {
        setImageDisplay("none");
        setMessageWrapperWidth("100%");
      }
    } else {
      setImageDisplay("none");
      setMessageWrapperWidth("100%");
    }
    setShowbanner(true);

  }

  if (showBanner) {
    return (
      <div className={styles.fullWidth}>
        <a className={styles.bannerLink} href={bannerLink} target="_blank" rel="noreferrer">
          <div className={styles.bannerWrapper}>
            {imageLeftOrRIght === "left" && <img src={bannerImage} style={{ display: imageDisplay }} className={styles.bannerImage} />}
            <div style={{ backgroundColor: bannerBackgroundColor, width: messageWrapperWidth }} className={styles.messageWrapper}>
              <p style={{ color: bannerTextColor, fontSize: bannerMessageFontSize }} className={styles.message}>{bannerMessage}</p>
              <p style={{ color: bannerTextColor, fontSize: bannerSubMessageFontSize }} className={styles.subMessage}>{bannerSubMessage}</p>
            </div>
            {imageLeftOrRIght === "right" && <img src={bannerImage} style={{ display: imageDisplay }} className={styles.bannerImage} />}
          </div>
        </a>
      </div>
    )
  } else {
    return (<></>)
  }
}

ParentId.schema = {
  title: 'editor.parentid.title',
  description: 'editor.parentid.description',
  type: 'object',
  properties: {}
}

export default ParentId;
