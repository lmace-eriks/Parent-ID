import React from 'react';
import { useState, useEffect, useRef, CSSProperties } from 'react';

// Styles
import styles from "./styles.css";

interface ParentIdProps {
  promos: Array<PromoObject>
}

interface PromoObject {
  date?: DateObject,
  text: TextObject,
  image: ImageObject
  bannerLink: string,
  backgroundColor: string,
  parentList: Array<string>
}

interface DateObject {
  from: string,
  to: string
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
    const myPromo = promos[index];

    if (myPromo.date) {
      const fromDate = Date.parse(myPromo.date.from);
      const toDate = Date.parse(myPromo.date.to);
      const todayDate = Date.now();

      if (fromDate > todayDate) return; // Promo Not Yet Active
      if (todayDate > toDate) return; // Promo Expired
    }

    setBannerMessage(myPromo.text.bannerMessage);
    setBannerMessageFontSize(myPromo.text.bannerMessageFontSize);
    setBannerSubMessage(myPromo.text.bannerSubMessage);
    setBannerSubMessageFontSize(myPromo.text.bannerSubMessageFontSize);
    setBannerLink(myPromo.bannerLink || "");
    setBannerTextColor(myPromo.text.textColor);
    setBannerBackgroundColor(myPromo.backgroundColor);

    // @ts-expect-error
    const windowWidth: number = window.innerWidth;

    if (myPromo.image) {
      setBannerImage(myPromo.image.src);
      setImageDisplay("block");
      setMessageWrapperWidth("50%");
      if (windowWidth >= 1026) {
        if (myPromo.image.imageLeftOrRight) {
          setImageLeftOrRight(myPromo.image.imageLeftOrRight);
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

  console.log(bannerLink);

  const innerBanner = <div className={styles.bannerWrapper}>
    {imageLeftOrRIght === "left" && <img src={bannerImage} style={{ display: imageDisplay }} className={styles.bannerImage} />}
    <div style={{ backgroundColor: bannerBackgroundColor, width: messageWrapperWidth }} className={styles.messageWrapper}>
      <p style={{ color: bannerTextColor, fontSize: bannerMessageFontSize }} className={styles.message}>{bannerMessage}</p>
      <p style={{ color: bannerTextColor, fontSize: bannerSubMessageFontSize }} className={styles.subMessage}>{bannerSubMessage}</p>
    </div>
    {imageLeftOrRIght === "right" && <img src={bannerImage} style={{ display: imageDisplay }} className={styles.bannerImage} />}
  </div>;

  if (showBanner) {
    return (
      <div className={styles.fullWidth}>
        {bannerLink ? <a className={styles.bannerLink} href={bannerLink} target="_blank" rel="noreferrer">{innerBanner}</a> : innerBanner}
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
