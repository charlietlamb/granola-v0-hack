import {
  BaseEdge,
  EdgeLabelRenderer,
  type EdgeProps,
  getSmoothStepPath,
} from "@xyflow/react";
import { useState } from "react";

interface EdgeData {
  timeGap: string;
  coachScoreDelta?: number;
  actionItemCount: number;
  sourceStatus: string;
  targetStatus: string;
}

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
  markerEnd,
  data,
  label,
  labelStyle,
  labelBgStyle,
}: EdgeProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const edgeData = data as unknown as EdgeData;

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={style}
      />
      <EdgeLabelRenderer>
        {label && (
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              fontSize: labelStyle?.fontSize || 12,
              pointerEvents: "all",
              zIndex: showTooltip ? 9998 : 1000,
            }}
            className="nodrag nopan"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <div
              style={{
                background: labelBgStyle?.fill || "#ffffff",
                opacity: labelBgStyle?.fillOpacity || 0.8,
                padding: "2px 6px",
                borderRadius: "4px",
                border: "1px solid #e2e8f0",
                color: labelStyle?.fill || "#64748b",
                fontWeight: labelStyle?.fontWeight || 500,
                fontSize: labelStyle?.fontSize || 10,
              }}
            >
              {label}
            </div>
            {showTooltip && edgeData && (
              <div
                className="absolute mt-2 p-3 bg-popover text-popover-foreground rounded-lg shadow-lg border border-border min-w-[200px]"
                style={{
                  left: "50%",
                  transform: "translateX(-50%)",
                  zIndex: 9999,
                }}
              >
                <div className="space-y-1.5 text-xs">
                  <div className="font-semibold text-sm mb-2">
                    Connection Details
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time gap:</span>
                    <span className="font-medium">{edgeData.timeGap}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Action items:</span>
                    <span className="font-medium">{edgeData.actionItemCount}</span>
                  </div>
                  {edgeData.coachScoreDelta !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Score change:</span>
                      <span
                        className={`font-medium ${
                          edgeData.coachScoreDelta > 0
                            ? "text-green-600"
                            : edgeData.coachScoreDelta < 0
                              ? "text-red-600"
                              : ""
                        }`}
                      >
                        {edgeData.coachScoreDelta > 0 ? "+" : ""}
                        {edgeData.coachScoreDelta}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between pt-1 mt-2 border-t border-border">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="font-medium capitalize">
                      {edgeData.sourceStatus === edgeData.targetStatus
                        ? edgeData.sourceStatus
                        : `${edgeData.sourceStatus} → ${edgeData.targetStatus}`}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </EdgeLabelRenderer>
    </>
  );
}
