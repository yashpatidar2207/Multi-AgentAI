import { useEffect, useState } from "react";

import {
  Coins,
  LogOut,
  Menu,
  MessageSquare,
  PanelLeftIcon,
  PanelRightIcon,
  PenSquare,
  Plus,
  User,
} from "lucide-react";

import { getConversations } from "../features/getConversations.js";

import {
  setConversations,
  setSelectedConversation,
} from "../redux/conversationSlice.js";

import { setUserData } from "../redux/userSlice.js";

import { useDispatch, useSelector } from "react-redux";

import logOut from "../features/logOut.js";

import { setMessages } from "../redux/messageSlice.js";

import BillingPage from "./BillingPage.jsx";

function SideBar() {
  const dispatch = useDispatch();

  const {
    conversations,
    selectedConversation,
  } = useSelector(
    (state) => state.conversation
  );

  const { userData } = useSelector(
    (state) => state.user
  );

  /* =========================================================
     DESKTOP SIDEBAR STATE
  ========================================================= */

  const [collapsed, setCollapsed] =
    useState(false);

  /* =========================================================
     USER IMAGE ERROR
  ========================================================= */

  const [imageError, setImageError] =
    useState(false);

  /* =========================================================
     BILLING STATE
  ========================================================= */

  const [showBilling, setShowBilling] =
    useState(false);

  /* =========================================================
     MOBILE SIDEBAR STATE

     Mobile sidebar width = 82vw
     Remaining = 18vw clickable backdrop
  ========================================================= */

  const [mobileOpen, setMobileOpen] =
    useState(false);

  /* =========================================================
     NEW CHAT
  ========================================================= */

  const handleNewChat = () => {
    dispatch(
      setSelectedConversation(null)
    );

    dispatch(
      setMessages([])
    );

    // Mobile sidebar close
    setMobileOpen(false);
  };

  /* =========================================================
     CLOSE MOBILE SIDEBAR
  ========================================================= */

  const closeMobileSidebar = () => {
    setMobileOpen(false);
  };

  /* =========================================================
     OPEN BILLING
  ========================================================= */

  const handleOpenBilling = () => {
    // First close mobile sidebar
    setMobileOpen(false);

    // Then open billing
    setShowBilling(true);
  };

  /* =========================================================
     CLOSE BILLING
  ========================================================= */

  const handleCloseBilling = () => {
    setShowBilling(false);
  };

  /* =========================================================
     SELECT CONVERSATION
  ========================================================= */

  const handleConversationClick = (
    conversation
  ) => {
    dispatch(
      setSelectedConversation(
        conversation
      )
    );

    // Mobile sidebar automatically closes
    setMobileOpen(false);
  };

  /* =========================================================
     GET CONVERSATIONS
  ========================================================= */

  useEffect(() => {
    const getConv = async () => {
      try {
        const data =
          await getConversations();

        dispatch(
          setConversations(data)
        );
      } catch (error) {
        console.log(
          "Error fetching conversations:",
          error
        );
      }
    };

    getConv();
  }, [userData, dispatch]);

  /* =========================================================
     COLLAPSED DESKTOP SIDEBAR
     
     Only visible on lg and above
  ========================================================= */

  if (collapsed) {
    return (
      <div
        className="
          hidden
          lg:flex
          flex-col
          items-center

          w-[56px]
          h-screen

          shrink-0

          bg-[#0d0f14]

          border-r
          border-white/[0.06]

          py-4
          gap-1
        "
      >
        {/* =================================================
            EXPAND SIDEBAR
        ================================================= */}

        <button
          onClick={() =>
            setCollapsed(false)
          }
          className="
            flex
            items-center
            justify-center

            w-9
            h-9

            rounded-xl

            text-slate-500

            hover:text-slate-200
            hover:bg-white/[0.05]

            transition-colors
            duration-150

            bg-transparent
            border-none

            cursor-pointer

            mb-1
          "
          title="Expand sidebar"
        >
          <PanelRightIcon
            size={18}
          />
        </button>

        {/* =================================================
            NEW CHAT
        ================================================= */}

        <button
          onClick={handleNewChat}
          className="
            flex
            items-center
            justify-center

            w-9
            h-9

            rounded-xl

            text-slate-500

            hover:text-slate-200
            hover:bg-white/[0.05]

            transition-colors
            duration-150

            bg-transparent
            border-none

            cursor-pointer
          "
          title="New Chat"
        >
          <Plus size={18} />
        </button>

        {/* =================================================
            CONVERSATIONS
        ================================================= */}

        <div
          className="
            flex-1
            w-full

            overflow-y-auto

            px-2.5
            pb-2

            [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden
          "
        >
          {conversations.map(
            (conv) => {
              const isActive =
                selectedConversation?._id ===
                conv?._id;

              return (
                <div
                  key={conv?._id}
                  onClick={() =>
                    handleConversationClick(
                      conv
                    )
                  }
                  className={`
                    flex
                    items-center
                    justify-center

                    cursor-pointer

                    mb-0.5

                    px-3
                    py-2.5

                    rounded-[10px]

                    border

                    transition-colors
                    duration-150

                    ${
                      isActive
                        ? "bg-white/[0.06] border-white/[0.08]"
                        : "bg-transparent border-transparent hover:bg-white/[0.05]"
                    }
                  `}
                >
                  <div
                    className={`
                      flex
                      items-center
                      justify-center

                      shrink-0

                      w-[28px]
                      h-[28px]

                      rounded-lg

                      transition-colors
                      duration-150

                      ${
                        isActive
                          ? "bg-white/[0.08] text-slate-300"
                          : "bg-white/[0.05] text-slate-500"
                      }
                    `}
                  >
                    <MessageSquare
                      size={14}
                    />
                  </div>
                </div>
              );
            }
          )}
        </div>

        {/* =================================================
            COLLAPSED USER
        ================================================= */}

        <div
          className="
            relative
            shrink-0
            mt-2
          "
        >
          {userData?.avatar &&
          !imageError ? (
            <img
              className="
                w-9
                h-9

                rounded-[18px]

                object-cover

                border-2
                border-white/10
              "
              src={userData?.avatar}
              alt={
                userData?.name ||
                "User"
              }
              onError={() =>
                setImageError(true)
              }
            />
          ) : (
            <div
              className="
                w-9
                h-9

                rounded-[18px]

                bg-white/[0.06]

                flex
                items-center
                justify-center
              "
            >
              <User
                size={15}
                className="text-slate-400"
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  /* =========================================================
     NORMAL SIDEBAR
  ========================================================= */

  return (
    <>
      {/* =====================================================
          MOBILE BACKDROP

          Sidebar = 82vw
          Remaining area = clickable

          Click outside sidebar -> close
      ===================================================== */}

      {mobileOpen && (
        <div
          onClick={closeMobileSidebar}
          className="
            fixed
            inset-0

            z-[55]

            bg-black/45
            backdrop-blur-[1px]

            lg:hidden
          "
        />
      )}

      {/* =====================================================
          MOBILE MENU BUTTON

          Only visible when sidebar is closed.
          No mobile X button.
      ===================================================== */}

      {!mobileOpen && (
        <button
          type="button"
          onClick={() =>
            setMobileOpen(true)
          }
          aria-label="Open sidebar"
          title="Open sidebar"
          className="
            lg:hidden

            fixed

            top-3
            left-3

            z-[70]

            flex
            items-center
            justify-center

            w-10
            h-10

            rounded-xl

            bg-[#151821]

            border
            border-white/[0.08]

            text-slate-400

            shadow-xl
            shadow-black/30

            hover:text-white
            hover:bg-white/[0.08]

            active:scale-95

            transition-all
            duration-200
          "
        >
          <Menu size={19} />
        </button>
      )}

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <div
        className={`
          fixed
          lg:static

          inset-y-0
          left-0

          z-[60]

          h-screen
          shrink-0

          bg-[#0d0f14]

          border-r
          border-white/[0.09]

          transition-transform
          duration-300
          ease-out

          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }

          w-[82vw]
          max-w-[360px]

          lg:w-[270px]
          lg:max-w-none
        `}
      >
        <div
          className="
            flex
            flex-col
            h-full
          "
        >
          {/* =================================================
              HEADER
          ================================================= */}

          <div
            className="
              flex
              items-center

              gap-2.5

              px-4
              py-4

              border-b
              border-white/[0.06]
            "
          >
            {/* Desktop Collapse */}

            <button
              type="button"
              className="
                hidden
                lg:flex

                items-center
                justify-center

                w-7
                h-7

                rounded-lg

                text-slate-500

                hover:text-slate-200
                hover:bg-white/[0.05]

                transition-colors
                duration-150

                bg-transparent
                border-none

                cursor-pointer
              "
              onClick={() =>
                setCollapsed(true)
              }
              title="Collapse sidebar"
            >
              <PanelLeftIcon
                size={18}
              />
            </button>

            {/* Logo */}

            <span
              className="
                text-[16px]

                font-semibold

                text-slate-100

                tracking-tight

                flex-1
              "
            >
              MultiAI
            </span>

            {/* Plan */}

            <span
              className="
                text-[10px]

                font-medium

                text-slate-400

                bg-white/[0.05]

                border
                border-white/[0.08]

                px-2
                py-0.5

                rounded-full

                tracking-wide
              "
            >
              {userData?.plan ||
                "free"}
            </span>

            {/* Header New Chat */}

            <button
              type="button"
              className="
                flex
                items-center
                justify-center

                w-7
                h-7

                rounded-lg

                text-slate-500

                hover:text-slate-200
                hover:bg-white/[0.05]

                transition-colors
                duration-150

                bg-transparent
                border-none

                cursor-pointer
              "
              onClick={handleNewChat}
              title="New Chat"
            >
              <PenSquare
                size={16}
              />
            </button>
          </div>

          {/* =================================================
              NEW CHAT BUTTON
              
              ChatGPT-style subtle button.
              Purple gradient removed.
          ================================================= */}

          <div
            className="
              px-4
              pt-4
              pb-1
            "
          >
            <button
              onClick={handleNewChat}
              className="
                w-full

                flex
                items-center
                justify-center

                gap-2

                text-sm
                font-medium

                text-slate-200

                bg-white/[0.06]

                border
                border-white/[0.08]

                rounded-xl

                py-[10px]

                cursor-pointer

                hover:bg-white/[0.10]
                hover:border-white/[0.12]

                active:scale-[0.99]

                transition-all
                duration-150
              "
            >
              <Plus
                size={16}
                className="text-slate-300"
              />

              New Chat
            </button>
          </div>

          {/* =================================================
              RECENTS TITLE
          ================================================= */}

          {conversations.length ===
          0 ? (
            <div
              className="
                px-5
                pt-4
                pb-1.5

                text-[10.5px]

                font-semibold

                uppercase

                tracking-widest

                text-slate-600
              "
            >
              No Recent Conversations
            </div>
          ) : (
            <div
              className="
                px-5
                pt-4
                pb-1.5

                text-[10.5px]

                font-semibold

                uppercase

                tracking-widest

                text-slate-600
              "
            >
              Recents
            </div>
          )}

          {/* =================================================
              CHAT LIST
          ================================================= */}

          <div
            className="
              flex-1

              overflow-y-auto

              px-2.5
              pb-2

              [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden
            "
          >
            {conversations.map(
              (conv) => {
                const isActive =
                  selectedConversation?._id ===
                  conv?._id;

                return (
                  <div
                    key={conv?._id}
                    onClick={() =>
                      handleConversationClick(
                        conv
                      )
                    }
                    className={`
                      flex
                      items-center

                      gap-2.5

                      cursor-pointer

                      mb-0.5

                      px-3
                      py-2.5

                      rounded-[10px]

                      border

                      transition-colors
                      duration-150

                      ${
                        isActive
                          ? "bg-white/[0.06] border-white/[0.08]"
                          : "bg-transparent border-transparent hover:bg-white/[0.05]"
                      }
                    `}
                  >
                    {/* Conversation Icon */}

                    <div
                      className={`
                        flex
                        items-center
                        justify-center

                        shrink-0

                        w-[28px]
                        h-[28px]

                        rounded-lg

                        transition-colors
                        duration-150

                        ${
                          isActive
                            ? "bg-white/[0.08] text-slate-300"
                            : "bg-white/[0.05] text-slate-500"
                        }
                      `}
                    >
                      <MessageSquare
                        size={14}
                      />
                    </div>

                    {/* Conversation Title */}

                    <span
                      className={`
                        text-[13px]

                        font-medium

                        truncate

                        ${
                          isActive
                            ? "text-slate-100"
                            : "text-slate-300"
                        }
                      `}
                    >
                      {conv?.title}
                    </span>
                  </div>
                );
              }
            )}
          </div>

          {/* =================================================
              DIVIDER
          ================================================= */}

          <div
            className="
              mx-2.5

              h-px

              bg-white/[0.06]
            "
          />

          {/* =================================================
              FOOTER
          ================================================= */}

          <div
            className="
              px-3.5
              py-3.5
            "
          >
            {userData ? (
              <div
                className="
                  flex
                  items-center

                  gap-2.5

                  rounded-xl

                  px-3
                  py-2.5

                  hover:bg-white/[0.05]

                  transition-colors
                  duration-150
                "
              >
                {/* =================================================
                    USER AVATAR
                ================================================= */}

                <div
                  className="
                    relative
                    shrink-0
                  "
                >
                  {userData?.avatar &&
                  !imageError ? (
                    <img
                      className="
                        w-9
                        h-9

                        rounded-[18px]

                        object-cover

                        border-2
                        border-white/10
                      "
                      src={
                        userData?.avatar
                      }
                      alt={
                        userData?.name ||
                        "User"
                      }
                      onError={() =>
                        setImageError(true)
                      }
                    />
                  ) : (
                    <div
                      className="
                        w-9
                        h-9

                        rounded-[18px]

                        bg-white/[0.06]

                        flex
                        items-center
                        justify-center
                      "
                    >
                      <User
                        size={15}
                        className="text-slate-400"
                      />
                    </div>
                  )}
                </div>

                {/* =================================================
                    USER DETAILS
                ================================================= */}

                <div
                  className="
                    flex-1
                    min-w-0
                  "
                >
                  <p
                    className="
                      text-[13.5px]

                      font-semibold

                      text-slate-100

                      truncate
                    "
                  >
                    {userData?.name ||
                      "Guest"}
                  </p>

                  <p
                    className="
                      text-[11px]

                      text-slate-600

                      mt-px
                    "
                  >
                    {userData?.plan}
                  </p>
                </div>

                {/* =================================================
                    FOOTER ACTIONS
                ================================================= */}

                <div
                  className="
                    flex
                    gap-1
                  "
                >
                  {/* =================================================
                      COINS / BILLING
                  ================================================= */}

                  <button
                    onClick={
                      handleOpenBilling
                    }
                    aria-label="Open Billing"
                    title="Billing"
                    className="
                      flex
                      items-center
                      justify-center

                      w-7
                      h-7

                      rounded-[15px]

                      border-none

                      bg-transparent

                      text-yellow-600

                      cursor-pointer

                      hover:bg-white/[0.08]
                      hover:text-yellow-400

                      transition-all
                      duration-150
                    "
                  >
                    <Coins
                      size={20}
                    />
                  </button>

                  {/* =================================================
                      LOGOUT
                  ================================================= */}

                  <button
                    className="
                      flex
                      items-center
                      justify-center

                      w-7
                      h-7

                      rounded-[15px]

                      border-none

                      bg-transparent

                      text-slate-600

                      cursor-pointer

                      hover:bg-white/[0.08]
                      hover:text-slate-400

                      transition-all
                      duration-150
                    "
                    onClick={() => {
                      logOut();

                      dispatch(
                        setUserData(null)
                      );

                      setMobileOpen(
                        false
                      );
                    }}
                    aria-label="Logout"
                    title="Logout"
                  >
                    <LogOut
                      size={20}
                    />
                  </button>
                </div>
              </div>
            ) : (
              /* =================================================
                 LOGIN
              ================================================= */

              <div className="px-2">
                <button
                  className="
                    w-full

                    flex
                    items-center
                    justify-center

                    gap-2

                    text-sm
                    font-medium

                    text-slate-200

                    bg-white/[0.05]

                    border
                    border-white/[0.08]

                    rounded-xl

                    py-[11px]

                    cursor-pointer

                    hover:bg-white/[0.08]

                    transition-colors
                    duration-150
                  "
                >
                  Login
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================
          BILLING PAGE

          Coins click:
          1. Sidebar closes
          2. Billing opens
      ========================================================= */}

      <BillingPage
        open={showBilling}
        onClose={
          handleCloseBilling
        }
      />
    </>
  );
}

export default SideBar;