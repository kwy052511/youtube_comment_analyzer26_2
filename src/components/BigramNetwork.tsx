'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { BigramNetworkData, NetworkNode, NetworkLink } from '@/types/analysis';
import { RotateCcw, ZoomIn, ZoomOut, Info } from 'lucide-react';

interface Props {
  data: BigramNetworkData;
  summary: string;
}

interface SimNode extends d3.SimulationNodeDatum {
  id: string;
  val: number;
}

interface SimLink extends d3.SimulationLinkDatum<SimNode> {
  source: SimNode | string;
  target: SimNode | string;
  weight: number;
}

export function BigramNetwork({ data, summary }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || !data.nodes.length) return;

    const width = containerRef.current.clientWidth || 800;
    const height = 520;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    svg.attr('viewBox', `0 0 ${width} ${height}`)
       .attr('width', '100%')
       .attr('height', height);

    // Zoom & Pan Container
    const g = svg.append('g').attr('class', 'network-container');

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
        setZoomLevel(Math.round(event.transform.k * 100) / 100);
      });

    svg.call(zoom);
    zoomBehaviorRef.current = zoom;

    // Deep copy nodes and links for D3 simulation
    const nodes: SimNode[] = data.nodes.map(d => ({ ...d }));
    const links: SimLink[] = data.links.map(d => ({ ...d }));

    // Boundary constraint to keep all pairs inside screen
    const padding = 50;
    const simulation = d3.forceSimulation<SimNode>(nodes)
      .force('link', d3.forceLink<SimNode, SimLink>(links).id(d => d.id).distance(80))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(d => (d as SimNode).val + 16))
      .force('boundary', () => {
        // 요구사항 7: 바이그램 단어 짝들을 화면 안쪽에 모두 배치
        for (const node of nodes) {
          if (node.x !== undefined) {
            node.x = Math.max(padding, Math.min(width - padding, node.x));
          }
          if (node.y !== undefined) {
            node.y = Math.max(padding, Math.min(height - padding, node.y));
          }
        }
      });

    // Links (edges)
    const link = g.append('g')
      .attr('stroke', '#cbd5e1')
      .attr('stroke-opacity', 0.8)
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke-width', d => Math.max(1.5, Math.min(d.weight * 1.5, 6)));

    // Edge weight label badges
    const linkText = g.append('g')
      .selectAll('text')
      .data(links.filter(l => l.weight > 1))
      .join('text')
      .attr('font-size', '10px')
      .attr('font-weight', '600')
      .attr('fill', '#64748b')
      .attr('text-anchor', 'middle')
      .text(d => `${d.weight}회`);

    // Drag behavior
    const dragBehavior = d3.drag<any, SimNode>()
      .on('start', (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (event, d) => {
        d.fx = Math.max(padding, Math.min(width - padding, event.x));
        d.fy = Math.max(padding, Math.min(height - padding, event.y));
      })
      .on('end', (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    // Nodes group
    const node = g.append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .attr('cursor', 'pointer')
      .call(dragBehavior as any);

    // Node circles (모던 라이트 테마: 화사하고 선명한 톤)
    node.append('circle')
      .attr('r', d => Math.max(14, d.val))
      .attr('fill', (d, i) => {
        const colors = [
          '#4f46e5', '#3b82f6', '#0284c7', '#0d9488', '#16a34a',
          '#d97706', '#db2777', '#7c3aed', '#ea580c'
        ];
        return colors[i % colors.length];
      })
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2.5)
      .attr('class', 'transition-all duration-200 hover:opacity-90 shadow-sm');

    // Node labels
    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '.35em')
      .attr('fill', '#ffffff')
      .attr('font-weight', '700')
      .attr('font-size', d => (d.val > 20 ? '12px' : '11px'))
      .attr('pointer-events', 'none')
      .text(d => d.id);

    node.on('click', (event, d) => {
      setSelectedNode(prev => (prev === d.id ? null : d.id));
    });

    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as SimNode).x!)
        .attr('y1', d => (d.source as SimNode).y!)
        .attr('x2', d => (d.target as SimNode).x!)
        .attr('y2', d => (d.target as SimNode).y!);

      linkText
        .attr('x', d => ((d.source as SimNode).x! + (d.target as SimNode).x!) / 2)
        .attr('y', d => ((d.source as SimNode).y! + (d.target as SimNode).y!) / 2 - 4);

      node.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [data]);

  const handleZoom = (factor: number) => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.transition().duration(300).call(zoomBehaviorRef.current.scaleBy, factor);
  };

  const handleResetZoom = () => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.transition().duration(400).call(zoomBehaviorRef.current.transform, d3.zoomIdentity);
    setSelectedNode(null);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Network Canvas (밝고 모던한 슬레이트 배경) */}
      <div className="relative w-full rounded-2xl bg-slate-50/80 border border-slate-200 overflow-hidden shadow-inner">
        {/* Controls */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-2 py-1.5 rounded-xl border border-slate-200 text-slate-700 shadow-sm text-xs">
          <button
            onClick={() => handleZoom(1.2)}
            title="확대"
            className="p-1 hover:text-indigo-600 hover:bg-slate-100 rounded transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleZoom(0.8)}
            title="축소"
            className="p-1 hover:text-indigo-600 hover:bg-slate-100 rounded transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetZoom}
            title="화면 리셋"
            className="p-1 hover:text-indigo-600 hover:bg-slate-100 rounded transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <span className="px-1.5 font-mono text-[11px] text-slate-500 border-l border-slate-200">
            {Math.round(zoomLevel * 100)}%
          </span>
        </div>

        {/* Status Indicator */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 shadow-sm text-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse"></span>
          <span className="font-medium">노드 {data.nodes.length}개 · 연결 {data.links.length}개</span>
          {selectedNode && (
            <span className="ml-2 font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
              선택: {selectedNode}
            </span>
          )}
        </div>

        {/* SVG Container */}
        <div ref={containerRef} className="w-full h-[520px] cursor-grab active:cursor-grabbing">
          <svg ref={svgRef} className="w-full h-full select-none" />
        </div>

        {/* Guide caption */}
        <div className="absolute bottom-3 left-4 text-[11px] text-slate-500 bg-white/80 backdrop-blur-sm px-2.5 py-1 rounded-md border border-slate-200">
          💡 노드를 드래그하여 이동하거나 휠로 줌/패닝할 수 있습니다. (화면 경계 이탈 방지 적용)
        </div>
      </div>

      {/* 요구사항 6: 바이그램에 대한 요약 정보를 바이그램 시각화 영역 아래에 추가 */}
      <div className="rounded-xl bg-indigo-50/70 border border-indigo-100 p-5">
        <div className="flex items-center gap-2 mb-2 text-indigo-900 font-bold typo-sub">
          <Info className="w-4 h-4 text-indigo-600" />
          바이그램(단어 쌍) 맥락 및 연결 요약 분석
        </div>
        <p className="typo-body text-slate-700 leading-relaxed font-normal">
          {summary}
        </p>
      </div>
    </div>
  );
}
