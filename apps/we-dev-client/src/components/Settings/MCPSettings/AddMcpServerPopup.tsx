import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MCPServer } from "@/types/mcp"
import useMCPSlice from "@/stores/useMCPSlice"
import { TopView } from "@/components/TopView"
import classNames from "classnames"

interface ShowParams {
    server?: MCPServer
    create?: boolean
}

interface Props extends ShowParams {
    resolve: (data: any) => void
}

interface MCPFormValues {
    name: string
    description?: string
    serverType: 'sse' | 'stdio'
    baseUrl?: string
    command?: string
    args?: string
    env?: string
    isActive: boolean
}

const CustomModal = ({ children, title, open, onOk, onCancel, okText, cancelText, confirmLoading }) => {
    if (!open) return null

    return (
        <div className="fixed inset-0 z-50">
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={onCancel} />
            <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-6">
                    <div className="relative w-full max-w-2xl transform rounded-xl bg-white dark:bg-gray-800 shadow-2xl transition-all">
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200/80 dark:border-gray-700/80">
                            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                                {title}
                            </h3>
                            <button
                                onClick={onCancel}
                                className="rounded-md p-1 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Content */}
                        <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
                            {children}
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200/80 dark:border-gray-700/80">
                            <button
                                type="button"
                                onClick={onCancel}
                                className={classNames(
                                    "px-4 py-2 text-sm font-medium rounded-lg",
                                    "text-gray-700 dark:text-gray-300",
                                    "bg-white dark:bg-gray-800",
                                    "border border-gray-300 dark:border-gray-600",
                                    "hover:bg-gray-50 dark:hover:bg-gray-700/50",
                                    "focus:outline-none focus:ring-2 focus:ring-purple-500/50",
                                    "transition duration-150 ease-in-out"
                                )}
                            >
                                {cancelText}
                            </button>
                            <button
                                type="button"
                                onClick={onOk}
                                disabled={confirmLoading}
                                className={classNames(
                                    "px-4 py-2 text-sm font-medium rounded-lg",
                                    "text-white",
                                    "bg-purple-600 hover:bg-purple-700",
                                    "dark:bg-purple-600 dark:hover:bg-purple-700",
                                    "focus:outline-none focus:ring-2 focus:ring-purple-500",
                                    "transition duration-150 ease-in-out",
                                    "disabled:opacity-50 disabled:cursor-not-allowed",
                                    "flex items-center gap-2"
                                )}
                            >
                                {confirmLoading && (
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                )}
                                {okText}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const FormField = ({ label, required, children, error, tooltip }: { label: any; required?: any; children: any; error?: any; tooltip?: any }) => (
    <div className="mb-4">
        <div className="flex items-center gap-2 mb-1.5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {tooltip && (
                <div className="group relative">
                    <svg className="w-4 h-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" />
                    </svg>
                    <div className="invisible group-hover:visible absolute left-full ml-2 w-48 p-2 bg-gray-900 text-white text-xs rounded shadow-lg">
                        {tooltip}
                    </div>
                </div>
            )}
        </div>
        {children}
        {error && (
            <p className="mt-1 text-xs text-red-500">{error}</p>
        )}
    </div>
)

const Input = ({ value, onChange, placeholder, disabled, className = "" }: { value: any; onChange: any; placeholder: any; disabled?: any; className?: string }) => (
    <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={classNames(
            "w-full px-3 py-2 text-sm rounded-lg",
            "bg-white dark:bg-gray-900",
            "border border-gray-300 dark:border-gray-600",
            "focus:outline-none focus:ring-2 focus:ring-purple-500/50",
            "disabled:bg-gray-100 dark:disabled:bg-gray-800",
            "disabled:cursor-not-allowed",
            "placeholder-gray-400 dark:placeholder-gray-500",
            "transition duration-200",
            className
        )}
    />
)

const TextArea = ({ value, onChange, placeholder, rows = 3, className = "" }: { value: any; onChange: any; placeholder: any; rows?: number; className?: string }) => (
    <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className={classNames(
            "w-full px-3 py-2 text-sm rounded-lg",
            "bg-white dark:bg-gray-900",
            "border border-gray-300 dark:border-gray-600",
            "focus:outline-none focus:ring-2 focus:ring-purple-500/50",
            "placeholder-gray-400 dark:placeholder-gray-500",
            "transition duration-200",
            "resize-y",
            className
        )}
    />
)

const RadioGroup = ({ value, onChange, options }) => (
    <div className="flex gap-2">
        {options.map((option) => (
            <button
                key={option.value}
                onClick={() => onChange(option.value)}
                className={classNames(
                    "px-4 py-2 text-sm font-medium rounded-lg",
                    "transition duration-200",
                    value === option.value ? (
                        "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                    ) : (
                        "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    ),
                    "border border-gray-300 dark:border-gray-600"
                )}
            >
                {option.label}
            </button>
        ))}
    </div>
)

const Toggle = ({ checked, onChange }) => (
    <button
        onClick={() => onChange(!checked)}
        className={classNames(
            "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out",
            checked ? "bg-purple-600" : "bg-gray-200 dark:bg-gray-700"
        )}
    >
        <span
            className={classNames(
                "inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                checked ? "translate-x-6" : "translate-x-1",
                "mt-0.5"
            )}
        />
    </button>
)

const PopupContainer: React.FC<Props> = ({ server, create, resolve }) => {
    const [open, setOpen] = useState(true)
    const { t } = useTranslation()
    const [formData, setFormData] = useState<MCPFormValues>({
        name: "",
        description: "",
        serverType: "stdio",
        baseUrl: "",
        command: "",
        args: "",
        env: "",
        isActive: true
    })
    const [errors, setErrors] = useState<Partial<MCPFormValues>>({})
    const [loading, setLoading] = useState(false)
    const mcpServers = useMCPSlice((state) => state.servers)

    useEffect(() => {
        if (server) {
            setFormData({
                name: server.name,
                description: server.description || "",
                serverType: server.baseUrl ? "sse" : "stdio",
                baseUrl: server.baseUrl || "",
                command: server.command || "",
                args: server.args ? server.args.join("\n") : "",
                env: server.env
                    ? Object.entries(server.env)
                        .map(([key, value]) => `${key}=${value}`)
                        .join("\n")
                    : "",
                isActive: server.isActive
            })
        }
    }, [server])

    const validateForm = () => {
        const newErrors: Partial<MCPFormValues> = {}
        
        if (!formData.name) {
            newErrors.name = t('settings.mcp.nameRequired')
        }
        
        if (formData.serverType === 'sse' && !formData.baseUrl) {
            newErrors.baseUrl = t('settings.mcp.baseUrlRequired')
        }
        
        if (formData.serverType === 'stdio' && !formData.command) {
            newErrors.command = t('settings.mcp.commandRequired')
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const onOK = async () => {
        if (!validateForm()) return

        setLoading(true)
        try {
            const mcpServer: MCPServer = {
                name: formData.name,
                description: formData.description,
                isActive: formData.isActive
            }

            if (formData.serverType === 'sse') {
                mcpServer.baseUrl = formData.baseUrl
            } else {
                mcpServer.command = formData.command
                mcpServer.args = formData.args ? formData.args.split('\n').filter(arg => arg.trim()) : []

                const env: Record<string, string> = {}
                if (formData.env) {
                    formData.env.split('\n').forEach(line => {
                        if (line.trim()) {
                            const [key, ...chunks] = line.split('=')
                            const value = chunks.join('=')
                            if (key && value) {
                                env[key.trim()] = value.trim()
                            }
                        }
                    })
                }
                mcpServer.env = Object.keys(env).length > 0 ? env : undefined
            }

            if (server && !create) {
                await window.myAPI.mcp.updateServer(mcpServer)
                console.info(t('settings.mcp.updateSuccess'))
            } else {
                if (mcpServers.some(s => s.name === mcpServer.name)) {
                    setErrors({ name: t('settings.mcp.duplicateName') })
                    setLoading(false)
                    return
                }
                await window.myAPI.mcp.addServer(mcpServer)
                console.info(t('settings.mcp.addSuccess'))
            }

            setLoading(false)
            setOpen(false)
            TopView.hide(TopViewKey)
        } catch (error: any) {
            console.error(server ? t('settings.mcp.updateError') : t('settings.mcp.addError'), error)
            setLoading(false)
        }
    }

    const onCancel = () => {
        setOpen(false)
        TopView.hide(TopViewKey)
    }

    AddMcpServerPopup.hide = onCancel

    return (
        <CustomModal
            title={server ? t('settings.mcp.editServer') : t('settings.mcp.addServer')}
            open={open}
            onOk={onOK}
            onCancel={onCancel}
            okText={t('common.confirm')}
            cancelText={t('common.cancel')}
            confirmLoading={loading}
        >
            <div className="space-y-6">
                <FormField
                    label={t('settings.mcp.name')}
                    required
                    error={errors.name}
                >
                    <Input
                        value={formData.name}
                        onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder={t('common.name')}
                        disabled={!!server}
                    />
                </FormField>

                <FormField label={t('settings.mcp.description')}>
                    <TextArea
                        value={formData.description}
                        onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder={t('common.description')}
                    />
                </FormField>

                <FormField label={t('settings.mcp.type')} required>
                    <RadioGroup
                        value={formData.serverType}
                        onChange={value => setFormData(prev => ({ ...prev, serverType: value }))}
                        options={[
                            { label: 'SSE (Server-Sent Events)', value: 'sse' },
                            { label: 'STDIO (Standard Input/Output)', value: 'stdio' }
                        ]}
                    />
                </FormField>

                {formData.serverType === 'sse' && (
                    <FormField
                        label={t('settings.mcp.url')}
                        required
                        error={errors.baseUrl}
                        tooltip={t('settings.mcp.baseUrlTooltip')}
                    >
                        <Input
                            value={formData.baseUrl}
                            onChange={e => setFormData(prev => ({ ...prev, baseUrl: e.target.value }))}
                            placeholder="http://localhost:3000/sse"
                        />
                    </FormField>
                )}

                {formData.serverType === 'stdio' && (
                    <>
                        <FormField
                            label={t('settings.mcp.command')}
                            required
                            error={errors.command}
                        >
                            <Input
                                value={formData.command}
                                onChange={e => setFormData(prev => ({ ...prev, command: e.target.value }))}
                                placeholder="uvx or npx"
                            />
                        </FormField>

                        <FormField
                            label={t('settings.mcp.args')}
                            tooltip={t('settings.mcp.argsTooltip')}
                        >
                            <TextArea
                                value={formData.args}
                                onChange={e => setFormData(prev => ({ ...prev, args: e.target.value }))}
                                placeholder={`arg1\narg2`}
                                className="font-mono"
                            />
                        </FormField>

                        <FormField
                            label={t('settings.mcp.env')}
                            tooltip={t('settings.mcp.envTooltip')}
                        >
                            <TextArea
                                value={formData.env}
                                onChange={e => setFormData(prev => ({ ...prev, env: e.target.value }))}
                                placeholder={`KEY1=value1\nKEY2=value2`}
                                className="font-mono"
                            />
                        </FormField>
                    </>
                )}

                <FormField label={t('settings.mcp.active')}>
                    <Toggle
                        checked={formData.isActive}
                        onChange={checked => setFormData(prev => ({ ...prev, isActive: checked }))}
                    />
                </FormField>
            </div>
        </CustomModal>
    )
}

const TopViewKey = 'AddMcpServerPopup'

export default class AddMcpServerPopup {
    static topviewId = 0
    static hide() {
        TopView.hide(TopViewKey)
    }
    static show(props: ShowParams = {}) {
        return new Promise<any>((resolve) => {
            TopView.show(
                <PopupContainer
                    {...props}
                    resolve={(v) => {
                        resolve(v)
                        TopView.hide(TopViewKey)
                    }}
                />,
                TopViewKey
            )
        })
    }
}