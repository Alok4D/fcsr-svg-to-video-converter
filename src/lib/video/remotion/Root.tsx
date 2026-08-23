import React from 'react';
import { Composition } from 'remotion';
import { SvgComposition } from './SvgComposition';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="SvgVideo"
        component={SvgComposition}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        calculateMetadata={({ props }: { props: any }) => {
          const fps = Number(props?.fps) || 30;
          const duration = Number(props?.duration) || 5;
          const width = Number(props?.width) || 1920;
          const height = Number(props?.height) || 1080;
          return {
            durationInFrames: Math.max(1, Math.round(duration * fps)),
            fps,
            width,
            height,
          };
        }}
        defaultProps={{
          svgCode: '<svg></svg>',
        }}
      />
    </>
  );
};



