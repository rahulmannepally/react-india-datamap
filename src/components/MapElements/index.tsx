import * as React from 'react'
import * as d3Scale from 'd3-scale'
import * as d3Interpolate from 'd3-interpolate'

import Title from './Title'
import DataMap from './DataMap'
import MapLegend from './MapLegend'
import { RegionData, MapLayout } from '../../index'

const DEFAULT_WIDTH = 800

interface MapElementsProps {
  mouseMoveOnDatamap(data: any): void
  mouseEnterOnDatamap(): void
  mouseLeaveDatamap(): void
  mouseEnterOnState(name: string, value: number): void
  regionData: RegionData
  extremeValues: {
    min: number
    max: number
  }
  mapLayout: MapLayout
  topoData: any[]
  infoWindowPos: {
    x: number
    y: number
  }
}

const MapElements = (props: MapElementsProps) => {
  const svgWidth = props.mapLayout.width || DEFAULT_WIDTH
  const svgHeight = props.mapLayout.height || svgWidth

  const { mapLayout, extremeValues, regionData } = props
  const { noDataColor, borderColor, hoverColor, startColor, endColor } = mapLayout

  const { min: minValue, max: maxValue } = extremeValues

  const svgStyle = {
    width: svgWidth,
    height: svgHeight,
    margin: 'auto',
    top: 15,
    left: 0,
    right: 0,
    display: 'flex'
  }

  const colorScale = d3Scale
    .scaleLinear()
    .domain([minValue, maxValue])
    // @ts-ignore
    .range([startColor, endColor])
    .interpolate(d3Interpolate.interpolateLab)

  const mapLegend = (
    <MapLegend
      svgWidth={svgWidth}
      svgHeight={svgHeight}
      extremeValues={extremeValues}
      mapLayout={mapLayout}
    />
  )

  const isNotExtremeValuesEmpty =
    !isNaN(minValue) && !isNaN(maxValue) && isFinite(minValue) && isFinite(maxValue)

  return (
    // @ts-ignore
    <svg style={svgStyle}>
      <g id="root-svg-group">
        <Title text={props.mapLayout.title} className="map-title" coords={{ x: 30, y: 40 }} />

        <DataMap
          topoData={props.topoData}
          regionData={regionData}
          svgWidth={svgWidth}
          svgHeight={svgHeight}
          colorScale={colorScale}
          noDataColor={noDataColor}
          borderColor={borderColor}
          hoverColor={hoverColor}
          mouseMoveOnDatamap={props.mouseMoveOnDatamap}
          mouseEnterOnDatamap={props.mouseEnterOnDatamap}
          mouseLeaveDatamap={props.mouseLeaveDatamap}
          mouseEnterOnState={props.mouseEnterOnState}
        />

        <Title
          text={props.mapLayout.legendTitle}
          className="legend-title"
          coords={{ x: svgWidth - 80, y: svgHeight - 85 }}
        />

        {isNotExtremeValuesEmpty && mapLegend}
      </g>
    </svg>
  )
}

const arePropsEqual = (prevProps: MapElementsProps, nextProps: MapElementsProps) => {
  return (
    prevProps.infoWindowPos.x === nextProps.infoWindowPos.x &&
    prevProps.infoWindowPos.y === nextProps.infoWindowPos.y &&
    prevProps.regionData === nextProps.regionData
  )
}

export default React.memo(MapElements, arePropsEqual)
