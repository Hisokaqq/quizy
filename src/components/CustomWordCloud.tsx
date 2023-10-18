"use client";
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import React from 'react'
import D3WordCloud from 'react-d3-cloud'
type Props = {
    formatedTopics: {text: string, value: number}[]
}





const fontSizeMapper = (word: {value: number}) => Math.log2(word.value) * 5 + 16;

const CustomWordCloud = ({formatedTopics}: Props) => {
    const theme = useTheme();
    const router = useRouter();
  return (
    <>
        <D3WordCloud height={550} font="Times" fontSize={fontSizeMapper} rotate={0} padding={10} 
            fill={theme.theme === 'dark' || theme.theme==="system" ? "white" : "black"}
            data = {formatedTopics}
            onWordClick={(event, word)=>{ router.push(`/quiz?topic=${word.text}`)}}
            onWordMouseOut={
                (event, word) => {
                    event.target.style.fontWeight = "normal";
                    document.body.style.cursor = "default";
                }
            }
            onWordMouseOver={
                (event, word) => {
                    event.target.style.fontWeight = "bold";
                    document.body.style.cursor = "pointer";
                }
            }
        />
    </>
  )
}

export default CustomWordCloud