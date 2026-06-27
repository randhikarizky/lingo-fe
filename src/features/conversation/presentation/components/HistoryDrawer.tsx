"use client";

import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Drawer from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import {
  useGetConversationList,
  useDeleteConversation,
} from "../controller/conversation.controller";
import type { ConversationListItem } from "../../data/network/conversation.api";
import {
  CHARACTER_EMOJIS,
  formatDifficultyLabel,
} from "@/features/learning/domain/constants/characters";

type Props = {
  open: boolean;
  onClose: () => void;
  activeId: string | null;
  onSelect: (id: string) => void;
};

function categorizeConversations(conversations: ConversationListItem[]) {
  const todayList: ConversationListItem[] = [];
  const yesterdayList: ConversationListItem[] = [];
  const olderList: ConversationListItem[] = [];

  const now = dayjs().startOf("day");
  const yesterday = dayjs().subtract(1, "day").startOf("day");

  conversations.forEach((item) => {
    const updated = dayjs(item.updatedAt);
    if (updated.isAfter(now) || updated.isSame(now, "day")) {
      todayList.push(item);
    } else if (updated.isAfter(yesterday) || updated.isSame(yesterday, "day")) {
      yesterdayList.push(item);
    } else {
      olderList.push(item);
    }
  });

  return { todayList, yesterdayList, olderList };
}

export default function HistoryDrawer({ open, onClose, activeId, onSelect }: Props) {
  const router = useRouter();
  const { data: conversations = [], isLoading } = useGetConversationList();
  const deleteConversation = useDeleteConversation();

  const { todayList, yesterdayList, olderList } = categorizeConversations(conversations);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm("Apakah Anda yakin ingin menghapus sesi latihan ini?")) {
      await deleteConversation.mutateAsync(id);
    }
  };

  const renderSection = (title: string, items: ConversationListItem[]) => {
    if (items.length === 0) return null;

    return (
      <Box sx={{ mb: 2.5 }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, px: 1, mb: 1, display: "block" }}>
          {title}
        </Typography>
        <Stack spacing={1}>
          {items.map((item) => {
            const isActive = item.id === activeId;
            const emoji = CHARACTER_EMOJIS[item.characterId] ?? "🎓";
            const isCompleted = item.status === "COMPLETED";

            return (
              <Card
                key={item.id}
                onClick={() => {
                  onClose();
                  if (isCompleted) {
                    router.push(`/practice/summary?id=${item.id}`);
                    return;
                  }
                  onSelect(item.id);
                }}
                sx={{
                  p: 1.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  border: "2px solid",
                  borderColor: isActive ? "primary.main" : "transparent",
                  bgcolor: isActive ? "primary.tonalContainer" : "background.paper",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: isActive ? "primary.tonalContainer" : "background.neutral",
                  },
                }}
              >
                <Stack direction="row" spacing={1.5} sx={{ flex: 1, minWidth: 0, alignItems: "center" }}>
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: "primary.tonalContainer",
                      color: "primary.onTonalContainer",
                      fontSize: 18,
                    }}
                  >
                    {emoji}
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Stack direction="row" spacing={0.75} sx={{ alignItems: "center", mb: 0.25 }}>
                      <Typography
                        variant="subtitle2"
                        noWrap
                        sx={{
                          color: isActive ? "primary.onTonalContainer" : "text.primary",
                          fontWeight: isActive ? 800 : 600,
                          flex: 1,
                        }}
                      >
                        {item.title}
                      </Typography>
                      {isCompleted && (
                        <Chip label="Selesai" size="small" color="success" variant="soft" />
                      )}
                    </Stack>
                    <Typography variant="caption" color="text.secondary" noWrap sx={{ display: "block" }}>
                      {item.scenarioLabel} · {formatDifficultyLabel(item.difficulty)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" noWrap sx={{ display: "block" }}>
                      {item.lastMessage || "Belum ada pesan"}
                    </Typography>
                  </Box>
                </Stack>
                <IconButton
                  size="small"
                  onClick={(e) => handleDelete(e, item.id)}
                  sx={{
                    color: "text.secondary",
                    "&:hover": { color: "error.main" },
                    ml: 1,
                  }}
                  disabled={deleteConversation.isPending}
                >
                  <DeleteRoundedIcon fontSize="small" />
                </IconButton>
              </Card>
            );
          })}
        </Stack>
      </Box>
    );
  };

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: 320,
            maxWidth: "85%",
            bgcolor: "background.default",
            borderTopRightRadius: 24,
            borderBottomRightRadius: 24,
            p: 2,
          },
        },
      }}
    >
      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 2.5 }}>
        <Typography variant="h6" sx={{ fontWeight: 800 }}>
          Riwayat Latihan
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseRoundedIcon />
        </IconButton>
      </Stack>

      <Button
        variant="contained"
        color="primary"
        startIcon={<AddRoundedIcon />}
        fullWidth
        onClick={() => {
          onClose();
          router.push("/practice");
        }}
        sx={{ mb: 2.5, height: 44, borderRadius: 100, fontWeight: 800 }}
      >
        Mulai Latihan Baru
      </Button>

      <Box sx={{ flex: 1, overflowY: "auto", pr: 0.5, mr: -0.5 }}>
        {isLoading ? (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", mt: 4 }}>
            Memuat riwayat...
          </Typography>
        ) : conversations.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", mt: 4 }}>
            Belum ada riwayat latihan.
          </Typography>
        ) : (
          <>
            {renderSection("Hari Ini", todayList)}
            {renderSection("Kemarin", yesterdayList)}
            {renderSection("Minggu Lalu", olderList)}
          </>
        )}
      </Box>
    </Drawer>
  );
}
