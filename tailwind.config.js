module.exports = {
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx}",
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "brand-color-main": "var(--brand-color-main)",
        "brand-color-accent": "var(--brand-color-accent)",
        "brand-color-accent-hover-light": "var(--brand-color-accent-hover-light)",
        "brand-color-main-hover-light": "var(--brand-color-main-hover-light)",
        "emailbrand-color-main": "var(--emailbrand-color-main)",
        "emailfont-font-color-body": "var(--emailfont-font-color-body)",
        "emailfont-font-color-head": "var(--emailfont-font-color-head)",
        "emailfont-font-color-inv": "var(--emailfont-font-color-inv)",
        "emailui-color-ui-01": "var(--emailui-color-ui-01)",
        "emailui-color-ui-04": "var(--emailui-color-ui-04)",
        "emailui-color-ui-05": "var(--emailui-color-ui-05)",
        "font-font-color-body": "var(--font-font-color-body)",
        "font-font-color-head": "var(--font-font-color-head)",
        "font-font-color-inv": "var(--font-font-color-inv)",
        "green-ins-color-green": "var(--green-ins-color-green)",
        "primary-02": "var(--primary-02)",
        "support-notifications-error": "var(--support-notifications-error)",
        "support-notifications-warning-hover":
          "var(--support-notifications-warning-hover)",
        "support-notifications-warning-hover-light":
          "var(--support-notifications-warning-hover-light)",
        "text-02": "var(--text-02)",
        "ui-color-ui-01": "var(--ui-color-ui-01)",
        "ui-color-ui-02": "var(--ui-color-ui-02)",
        "ui-color-ui-03": "var(--ui-color-ui-03)",
        "ui-color-ui-04": "var(--ui-color-ui-04)",
        "ui-color-ui-05": "var(--ui-color-ui-05)",
        "ui-color-ui-08": "var(--ui-color-ui-08)",
        "white-ins-color-white": "var(--white-ins-color-white)",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        "button-button-default": "var(--button-button-default-font-family)",
        "ecommerce-product-current-price":
          "var(--ecommerce-product-current-price-font-family)",
        "ecommerce-product-old-price":
          "var(--ecommerce-product-old-price-font-family)",
        "form-form-label": "var(--form-form-label-font-family)",
        "form-form-notes": "var(--form-form-notes-font-family)",
        "form-form-placeholder": "var(--form-form-placeholder-font-family)",
        "heading-heading-4": "var(--heading-heading-4-font-family)",
        "heading-heading-5": "var(--heading-heading-5-font-family)",
        "heading-heading-5-small": "var(--heading-heading-5-small-font-family)",
        "paragraph-body": "var(--paragraph-body-font-family)",
        "paragraph-body-bold": "var(--paragraph-body-bold-font-family)",
        "paragraph-body-small": "var(--paragraph-body-small-font-family)",
        "paragraph-body-small-bold":
          "var(--paragraph-body-small-bold-font-family)",
        "paragraph-body-x-small": "var(--paragraph-body-x-small-font-family)",
        "paragraph-body-x-small-bold":
          "var(--paragraph-body-x-small-bold-font-family)",
        "paragraph-button-button-large":
          "var(--paragraph-button-button-large-font-family)",
        "paragraph-form-form-label":
          "var(--paragraph-form-form-label-font-family)",
        "paragraph-form-form-placeholder":
          "var(--paragraph-form-form-placeholder-font-family)",
        "paragraph-UI-ui-tooltip": "var(--paragraph-UI-ui-tooltip-font-family)",
        sans: [
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
        arabic: ['ThmanyahSerifDisplay', 'ThmanyahSerifText', 'Arial', 'sans-serif'],
        english: ['Satoshi', 'Inter', 'sans-serif'],
      },
      boxShadow: { "shadow-shadow-level-1": "var(--shadow-shadow-level-1)" },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
    container: { center: true, padding: "2rem", screens: { "2xl": "1400px" } },
  },
  plugins: [],
  darkMode: ["class"],
};
