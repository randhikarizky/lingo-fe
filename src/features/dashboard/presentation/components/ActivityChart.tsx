"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import dayjs from "dayjs";
import "dayjs/locale/id"; // ensure Indonesian month formatting support

dayjs.locale("id");

type ProgressActivity = {
  date: string;
  messages: number;
};

type Props = {
  data: ProgressActivity[];
};

export default function ActivityChart({ data }: Props) {
  const theme = useTheme();
  const [hovered, setHovered] = useState<{ index: number; x: number; y: number } | null>(
    null
  );

  if (data.length === 0) {
    return (
      <Box sx={{ py: 6, textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary">
          Belum ada aktivitas terekam.
        </Typography>
      </Box>
    );
  }

  const chartHeight = 130;
  const padding = { top: 15, bottom: 25, left: 10, right: 10 };
  const totalHeight = chartHeight + padding.top + padding.bottom;

  const barWidth = 14;
  const barGap = 10;
  const totalWidth =
    data.length * (barWidth + barGap) - barGap + padding.left + padding.right;

  const maxMessages = Math.max(...data.map((d) => d.messages), 0);
  const scaleMax = maxMessages === 0 ? 5 : Math.ceil(maxMessages / 5) * 5;

  return (
    <Box sx={{ position: "relative", width: "100%" }}>
      <Box
        sx={{
          width: "100%",
          overflowX: "auto",
          pb: 1,
          "&::-webkit-scrollbar": { height: 6 },
          "&::-webkit-scrollbar-thumb": {
            bgcolor: "divider",
            borderRadius: 3,
          },
        }}
      >
        <Box
          sx={{
            width: totalWidth,
            minWidth: "100%",
            height: totalHeight,
            position: "relative",
          }}
        >
          <svg width={totalWidth} height={totalHeight} style={{ overflow: "visible" }}>
            {/* Grid Lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const val = scaleMax * ratio;
              const y = chartHeight - (val / scaleMax) * chartHeight + padding.top;
              return (
                <g key={ratio}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={totalWidth - padding.right}
                    y2={y}
                    stroke={theme.palette.divider}
                    strokeDasharray="4 4"
                    strokeWidth={1}
                  />
                  {(ratio === 0 || ratio === 1 || ratio === 0.5) && (
                    <text
                      x={padding.left + 2}
                      y={y - 4}
                      fill={theme.palette.text.secondary}
                      fontSize="9px"
                      fontWeight={700}
                    >
                      {Math.round(val)} msg
                    </text>
                  )}
                </g>
              );
            })}

            {/* Bars */}
            {data.map((item, idx) => {
              const x = padding.left + idx * (barWidth + barGap);
              const barHeight =
                scaleMax === 0 ? 0 : (item.messages / scaleMax) * chartHeight;
              const y = chartHeight - barHeight + padding.top;
              const isHovered = hovered?.index === idx;

              return (
                <g key={item.date}>
                  {/* Bar Background Track */}
                  <rect
                    x={x}
                    y={padding.top}
                    width={barWidth}
                    height={chartHeight}
                    fill={theme.palette.action.hover}
                    rx={barWidth / 2}
                  />

                  {/* Active Bar */}
                  {item.messages > 0 && (
                    <rect
                      x={x}
                      y={y}
                      width={barWidth}
                      height={barHeight}
                      fill={
                        isHovered
                          ? theme.palette.primary.dark
                          : theme.palette.primary.main
                      }
                      rx={barWidth / 2}
                      style={{ transition: "fill 0.15s ease, height 0.3s ease" }}
                    />
                  )}

                  {/* Hover Hit Target */}
                  <rect
                    x={x - barGap / 2}
                    y={padding.top}
                    width={barWidth + barGap}
                    height={chartHeight + padding.bottom}
                    fill="transparent"
                    style={{ cursor: "pointer" }}
                    onMouseEnter={() =>
                      setHovered({
                        index: idx,
                        x: x + barWidth / 2,
                        y: y - 8,
                      })
                    }
                    onMouseLeave={() => setHovered(null)}
                  />

                  {/* X-Axis labels (every 3 days + final date) */}
                  {(idx % 3 === 0 || idx === data.length - 1) && (
                    <text
                      x={x + barWidth / 2}
                      y={chartHeight + padding.top + 16}
                      textAnchor="middle"
                      fill={theme.palette.text.secondary}
                      fontSize="10px"
                      fontWeight={700}
                    >
                      {dayjs(item.date).format("D")}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Tooltip */}
          {hovered && (
            <Paper
              elevation={3}
              sx={{
                position: "absolute",
                left: hovered.x,
                top: hovered.y,
                transform: "translate(-50%, -100%)",
                px: 1.25,
                py: 0.75,
                zIndex: 10,
                borderRadius: 2,
                pointerEvents: "none",
                bgcolor: "background.paper",
                boxShadow: theme.shadows[3],
                whiteSpace: "nowrap",
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 800, display: "block" }}>
                {dayjs(data[hovered.index].date).format("D MMMM YYYY")}
              </Typography>
              <Typography variant="caption" color="primary" sx={{ fontWeight: 800 }}>
                {data[hovered.index].messages} Pesan
              </Typography>
            </Paper>
          )}
        </Box>
      </Box>
    </Box>
  );
}
