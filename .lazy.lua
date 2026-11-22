-- Project-local LazyVim overrides, loaded by lazy.nvim from the working directory.

local filetypes = { "markdown", "markdown.mdx" }

return {
	{
		"stevearc/conform.nvim",
		opts = function(_, opts)
			for _, ft in ipairs(filetypes) do
				opts.formatters_by_ft[ft] = { "oxfmt" }
			end
		end,
	},
	{
		"mfussenegger/nvim-lint",
		opts = function(_, opts)
			for _, ft in ipairs(filetypes) do
				opts.linters_by_ft[ft] = {}
			end
		end,
	},
}
