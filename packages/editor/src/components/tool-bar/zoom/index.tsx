import { FC, useEffect, useState } from 'react';
import { ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons';
import { Space } from 'antd';

import BtnTooltipIcon from '@/components/btn-tooltip-icon';
import { scaleFormatter } from '@/utils';
import { Graph } from '@antv/x6';
import { MAX_ZOOM, MIN_ZOOM, ZOOM_STEP } from '@/utils/constant';

import { Keyboard } from '@antv/x6-plugin-keyboard';

interface ZoomProps {
  graph: Graph | undefined;
}

const Zoom: FC<ZoomProps> = ({ graph }) => {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    graph?.use(
      new Keyboard({
        enabled: true,
        global: true,
      }),
    );

    graph?.on('scale', () => {
      setScale(graph.zoom());
    });

    graph?.bindKey('meta + shift + +', () => {
      handleZoomInOutClick();
    });

    graph?.bindKey('meta + shift + -', () => {
      handleZoomOutClick();
    });
  }, [graph]);

  const handleZoomOutClick = () => {
    const nextZoom = ((graph?.zoom() || 0) - ZOOM_STEP).toPrecision(2);
    graph?.zoomTo(Number(nextZoom), { minScale: MIN_ZOOM });
  };

  const handleZoomInOutClick = () => {
    const nextZoom = ((graph?.zoom() || 0) + ZOOM_STEP).toPrecision(2);
    graph?.zoomTo(Number(nextZoom), { maxScale: MAX_ZOOM });
  };

  return (
    <Space>
      <BtnTooltipIcon
        tooltip="缩小：快捷键 meta + shift + -"
        icon={<ZoomOutOutlined />}
        disabled={scale < MIN_ZOOM}
        onClick={handleZoomOutClick}
      />

      <span className="zoomText">{scaleFormatter(scale)}</span>

      <BtnTooltipIcon
        tooltip="放大：快捷键 meta + shift + +"
        icon={<ZoomInOutlined />}
        disabled={scale > MAX_ZOOM}
        onClick={handleZoomInOutClick}
      />
    </Space>
  );
};

export default Zoom;
